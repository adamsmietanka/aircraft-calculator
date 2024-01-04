import { Text } from "@react-three/drei";
import {
  CANVAS_WIDTH,
  FONT_SIZE,
  NUMBERS_PADDING,
  TITLE_PADDING,
  useCSSColors,
} from "./config";
import useChartUnits from "../../settings/hooks/useChartUnits";
import {
  SpringValue,
  animated,
  config,
  to,
  useSpring,
} from "@react-spring/three";
import { Axis } from "./LineChart";
import { useEffect, useMemo, useRef, useState } from "react";
import { checkVisible } from "./checkVisible";
import { useLocation } from "react-router-dom";
import AnimatedHtml from "./AnimatedHtml";
import { CylinderGeometry, InstancedMesh, Object3D, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

interface AxisProps {
  show: boolean;
  ticks: number[];
  axis: Axis;
  scale: number[];
  min: Record<string, number>;
  max: Record<string, number>;
  mid: number;
  width: number;
  stepOpacity?: SpringValue<number>;
}

const LinesHorizontal = ({
  show,
  ticks,
  axis,
  scale,
  min,
  max,
  mid,
  width,
  stepOpacity = new SpringValue(1),
}: AxisProps) => {
  const AnimatedText = animated(Text);
  const { gridColor } = useCSSColors();

  const meshRef = useRef<THREE.Mesh>(null!);
  const { pathname } = useLocation();

  const [title, titleApi] = useSpring(
    () => ({
      opacity: 0,
      config: config.molasses,
    }),
    []
  );

  useEffect(() => {
    const vis = show && checkVisible(meshRef.current);
    if (vis) {
      titleApi.start({ opacity: 1, delay: 1600 });
    } else {
      titleApi.start({ opacity: 0, delay: 0 });
    }
  }, [pathname, show]);

  const { unit } = useChartUnits(axis.type as string);

  const instancedMeshRef = useRef<InstancedMesh>(null!);

  const geom = useMemo(() => {
    const height = width * CANVAS_WIDTH - 3;
    const cylinder = new CylinderGeometry(0.005, 0.005, height, 4);
    cylinder.translate(0, height / 2, 0);
    cylinder.rotateZ(-Math.PI / 2);
    return cylinder;
  }, []);

  const [objects] = useState(() =>
    [...new Array(15)].map(() => new Object3D())
  );

  const vec = useMemo(() => new Vector3(1, 1, 1), []);

  useFrame(() => {
    let id = 0;
    const s = stepOpacity.get();
    for (let i = 0; i < 15; i += 1) {
      instancedMeshRef.current.getMatrixAt(id, objects[id].matrix);
      objects[id].position.set(0, ticks[i] * scale[1], 0);

      // highlight zeros
      if (ticks[i] === 0) objects[id].scale.setY(3);

      // show all ticks below maximum
      if (ticks[i] <= max.y / scale[1])
        objects[id].scale.lerp(
          vec.setX(s),
          // hide all at the same time or trail
          stepOpacity.animation.to === 0
            ? 0.2 - (5 - id) / 16 / 3
            : 0.2 - id / 16 / 3
        );
      else {
        objects[id].scale.lerp(vec.setX(0.001), 0.2 + id / 16 / 3);
      }
      objects[id].updateMatrix();
      instancedMeshRef.current.setMatrixAt(id, objects[id++].matrix);
    }
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef}>
      <instancedMesh
        ref={instancedMeshRef}
        args={[geom, undefined, 15]}
        position-x={min.x}
      >
        <meshBasicMaterial color={gridColor} transparent opacity={0.5} />
      </instancedMesh>

      {ticks.map(
        (t, i) =>
          ticks[i] <= max.y / scale[1] && (
            <AnimatedHtml
              key={t}
              className="text-xs"
              show={show}
              delayVisible={800}
              position={[
                min.x - 1.25 * NUMBERS_PADDING,
                ticks[i] * scale[1],
                0,
              ]}
            >
              {t}
            </AnimatedHtml>
          )
      )}
      {axis.symbol ? (
        <AnimatedHtml
          show={show}
          delayVisible={1000}
          position={[min.x - TITLE_PADDING, mid + 0.25, 0.5]}
        >
          {axis.symbol}
        </AnimatedHtml>
      ) : (
        <AnimatedText
          position={[min.x - 1.2 * TITLE_PADDING, mid + 1, 0.5]}
          rotation-z={Math.PI / 2}
          fontSize={0.6 * FONT_SIZE}
          color={gridColor}
          fillOpacity={to(
            [title.opacity, stepOpacity],
            (opacity, stepOpacity) => opacity * stepOpacity
          )}
        >
          {`${axis.name} ${unit && `[${unit}]`}`}
        </AnimatedText>
      )}
    </mesh>
  );
};

export default LinesHorizontal;
