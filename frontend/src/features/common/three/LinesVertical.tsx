import { Text } from "@react-three/drei";
import {
  CANVAS_HEIGHT,
  FONT_SIZE,
  NUMBERS_PADDING,
  TITLE_PADDING,
  useCSSColors,
} from "./config";
import useChartUnits from "../../settings/hooks/useChartUnits";
import {
  animated,
  useSpring,
  config,
  SpringValue,
  to,
} from "@react-spring/three";
import { Axis } from "./LineChart";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { checkVisible } from "./checkVisible";
import AnimatedHtml from "./AnimatedHtml";
import { Object3D } from "three/src/core/Object3D";
import { CylinderGeometry, InstancedMesh, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

interface AxisProps {
  show: boolean;
  ticks: number[];
  axis: Axis;
  scale: number[];
  min: Record<string, number>;
  max: Record<string, number>;
  mid: number;
  stepOpacity: SpringValue<number>;
  scaleX: SpringValue<number>;
  scaleY: SpringValue<number>;
}

const LinesVertical = ({
  show,
  ticks,
  axis,
  scale,
  min,
  max,
  mid,
  stepOpacity,
  scaleX,
  scaleY,
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
      titleApi.start({ opacity: 1, delay: 1600, config: config.molasses });
    } else {
      titleApi.start({ opacity: 0, delay: 0 });
    }
  }, [pathname, show]);

  const { unit } = useChartUnits(axis.type as string);

  const instancedMeshRef = useRef<InstancedMesh>(null!);

  const geom = useMemo(() => {
    const height = 0.85 * CANVAS_HEIGHT - 0.5;
    const cylinder = new CylinderGeometry(0.005, 0.005, height, 4);
    cylinder.translate(0, height / 2, 0);
    return cylinder;
  }, []);

  const [objects] = useState(() =>
    [...new Array(15)].map(() => new Object3D())
  );

  const vec = useMemo(() => new Vector3(1, 1, 1), []);

  useFrame(() => {
    let id = 0;
    const s = stepOpacity.get();
    const scaleInterpolated = scaleX.get();
    for (let i = 0; i < 15; i += 1) {
      instancedMeshRef.current.getMatrixAt(id, objects[id].matrix);
      objects[id].position.set(ticks[i] * scaleInterpolated, 0, 0);

      // highlight zeros
      if (ticks[i] === 0) objects[id].scale.setX(3);

      // show all ticks below maximum
      if (ticks[i] <= max.x / scaleInterpolated)
        objects[id].scale.lerp(
          vec.setY(s),
          // hide all at the same time or trail
          stepOpacity.animation.to === 0
            ? 0.2 - (5 - id) / 16 / 3
            : 0.2 - id / 16 / 3
        );
      else {
        objects[id].scale.lerp(vec.setY(0.001), 0.2 + id / 16 / 3);
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
        position-y={min.y}
      >
        <meshBasicMaterial color={gridColor} transparent opacity={0.5} />
      </instancedMesh>

      {ticks.map(
        (t, i) =>
          ticks[i] <= max.x / scale[0] && (
            <AnimatedHtml
              className="text-xs"
              show={show}
              delayVisible={800}
              position={scaleX.to((s) => [
                s * ticks[i],
                min.y - NUMBERS_PADDING,
                0,
              ])}
            >
              {t}
            </AnimatedHtml>
          )
      )}
      {axis.symbol ? (
        <AnimatedHtml
          show={show}
          delayVisible={1000}
          position={[mid + 1.5, min.y - TITLE_PADDING, 0]}
        >
          {axis.symbol}
        </AnimatedHtml>
      ) : (
        <AnimatedText
          position={[mid + 1.5, min.y - TITLE_PADDING, 0]}
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

export default LinesVertical;
