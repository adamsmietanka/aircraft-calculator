import AnimatedInputTechnical from "../../common/drawings/AnimatedInputTechnical";
import { usePlaneStore } from "../stores/usePlane";
import { Props } from "../../common/types/three";
import InputDrawing from "../../common/inputs/InputDrawing";
import { useLocation } from "react-router-dom";
import { useHorizontalStore } from "../stores/useHorizontal";
import useHorizontal from "./hooks/useHorizontal";
import AnimatedLine from "../../common/three/AnimatedLine";
import { getXTip } from "./hooks/useWingSpring";
import { animated } from "@react-spring/three";

const StabilizerHorizontal = ({ opacity }: Props) => {
  const chord = useHorizontalStore((state) => state.chord);
  const span = useHorizontalStore((state) => state.span);
  const angle = useHorizontalStore((state) => state.angle);
  const chordTip = useHorizontalStore((state) => state.chordTip);
  const setSpan = useHorizontalStore((state) => state.setSpan);
  const setChord = useHorizontalStore((state) => state.setChord);
  const setChordTip = useHorizontalStore((state) => state.setChordTip);

  const shape = useHorizontalStore((state) => state.shape);
  const length = usePlaneStore((state) => state.length);

  const { pathname } = useLocation();

  const { horizontal, leading, trailing, top } = useHorizontal();

  return (
    <mesh rotation-x={-Math.PI / 2}>
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
      <mesh rotation-z={(90 * Math.PI) / 180}>
        <AnimatedInputTechnical
          visible={pathname === "/aerodynamics/horizontal"}
          distance={1}
          valueY={-getXTip(angle, span)}
          value={span / 2}
          opacity={opacity.to((o) => 0.75 * o)}
        >
          <InputDrawing
            value={span / 2}
            setter={setSpan}
            min={chord}
            max={length / 2}
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
    </mesh>
  );
};

export default StabilizerHorizontal;
