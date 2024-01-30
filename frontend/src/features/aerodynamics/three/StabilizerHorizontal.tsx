import AnimatedInputTechnical from "../../common/drawings/AnimatedInputTechnical";
import { usePlaneStore } from "../stores/usePlane";
import { Props } from "../../common/types/three";
import InputDrawing from "../../common/inputs/InputDrawing";
import { useLocation } from "react-router-dom";
import { useHorizontalStore } from "../stores/useHorizontal";
import useHorizontal from "./hooks/useHorizontal";
import AnimatedLine from "../../common/three/AnimatedLine";
import { getXTip } from "./hooks/useWingSpring";
import { animated, useSpring } from "@react-spring/three";
import useHorizontalPosition from "./hooks/useHorizontalPosition";

const StabilizerHorizontal = ({ opacity }: Props) => {
  const chord = useHorizontalStore((state) => state.chord);
  const span = useHorizontalStore((state) => state.span);
  const angle = useHorizontalStore((state) => state.angle);
  const chordTip = useHorizontalStore((state) => state.chordTip);
  const setSpan = useHorizontalStore((state) => state.setSpan);
  const setChordTip = useHorizontalStore((state) => state.setChordTip);

  const shape = useHorizontalStore((state) => state.shape);
  const verticalX = usePlaneStore((state) => state.verticalX);
  const length = usePlaneStore((state) => state.length);

  const { pathname } = useLocation();

  const { horizontal, leading, trailing, top } = useHorizontal();
  const { positionLeadTrail, y } = useHorizontalPosition();

  const [spring] = useSpring(
    () => ({
      y,
      x: positionLeadTrail[0] + verticalX,
    }),
    [y, positionLeadTrail, verticalX]
  );

  return (
    <animated.mesh
      position-y={spring.y}
      position-x={spring.x}
      rotation-x={-Math.PI / 2}
    >
      <mesh
        visible={pathname === "/aerodynamics/results"}
        rotation-x={-Math.PI / 2}
        geometry={horizontal}
      >
        <animated.meshStandardMaterial
          color="white"
          metalness={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* <AnimatedInputTechnical
        visible={pathname === "/aerodynamics/horizontal"}
        distance={1}
        value={chord}
        opacity={opacity.to((o) => 0.75 * o)}
        outside
      >
        <InputDrawing value={chord} setter={setChord} />
      </AnimatedInputTechnical> */}
      <mesh rotation-z={(-90 * Math.PI) / 180}>
        <AnimatedInputTechnical
          visible={pathname === "/aerodynamics/horizontal"}
          distance={2}
          y={shape === 2 ? 0.3 * chord : getXTip(angle, span)}
          startX={-span / 2}
          value={span}
          opacity={opacity.to((o) => 0.75 * o)}
        >
          <InputDrawing
            value={span}
            setter={setSpan}
            min={chord}
            max={length}
          />
        </AnimatedInputTechnical>
      </mesh>
      <AnimatedInputTechnical
        visible={pathname === "/aerodynamics/horizontal" && shape === 1}
        distance={1}
        value={chordTip}
        y={span / 2}
        startX={getXTip(angle, span)}
        opacity={opacity.to((o) => 0.75 * o)}
      >
        <InputDrawing value={chordTip} setter={setChordTip} />
      </AnimatedInputTechnical>
      <mesh
        visible={
          pathname === "/aerodynamics/fuselage" ||
          pathname === "/aerodynamics/horizontal"
        }
      >
        <AnimatedLine points={leading} color="grid" opacity={opacity} />
        <AnimatedLine points={trailing} color="grid" opacity={opacity} />
        <AnimatedLine points={top} color="grid" opacity={opacity} />
        <AnimatedLine
          points={top.map(([x, y, z]) => [x, -y, z])}
          color="grid"
          opacity={opacity}
        />
      </mesh>
    </animated.mesh>
  );
};

export default StabilizerHorizontal;
