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
import { DoubleSide } from "three";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "../../navigation/PlaneBuilder";

const meshVisible = ["/aerodynamics/results", "/aerodynamics/glide"];

const Elevator = ({ opacity, stabilizer }: Props & { stabilizer: any }) => {
  const up = useKeyboardControls<Controls>((state) => state.up);
  const down = useKeyboardControls<Controls>((state) => state.down);

  const chord = useHorizontalStore((state) => state.chord);
  const span = useHorizontalStore((state) => state.span);

  const { pathname } = useLocation();

  const [spring] = useSpring(
    () => ({
      angle: (((+down - +up) * 30) / 180) * Math.PI,
    }),
    [up, down]
  );

  const flapY = (span * stabilizer.FLAP_START) / 2;
  const flapX =
    stabilizer.getChord(flapY) * stabilizer.FLAP_CHORD_START +
    stabilizer.getLE(flapY);

  return (
    <animated.mesh
      position-x={flapX}
      position-z={flapY}
      rotation-y={stabilizer.getFlapAxisAngle()}
      rotation-z={spring.angle}
    >
      <mesh rotation-y={-stabilizer.getFlapAxisAngle()}>
        <mesh
          visible={meshVisible.includes(pathname)}
          geometry={stabilizer.flap}
          position-x={-flapX}
          position-z={-flapY}
        >
          <animated.meshStandardMaterial
            color="white"
            metalness={0.5}
            transparent
            opacity={opacity}
          />
        </mesh>
      </mesh>
    </animated.mesh>
  );
};

const StabilizerHorizontal = ({ opacity }: Props) => {
  const chord = useHorizontalStore((state) => state.chord);
  const span = useHorizontalStore((state) => state.span);
  const angle = useHorizontalStore((state) => state.angle);
  const chordTip = useHorizontalStore((state) => state.chordTip);
  const setSpan = useHorizontalStore((state) => state.setSpan);
  const setChordTip = useHorizontalStore((state) => state.setChordTip);

  const shape = useHorizontalStore((state) => state.shape);
  const verticalX = usePlaneStore((state) => state.verticalX);
  const horizontalX = usePlaneStore((state) => state.horizontalX);
  const horizontalY = usePlaneStore((state) => state.horizontalY);
  const length = usePlaneStore((state) => state.length);

  const { pathname } = useLocation();

  const { leading, trailing, top, stabilizer } = useHorizontal();
  useHorizontalPosition();

  const [spring] = useSpring(
    () => ({
      y: horizontalY,
      x: horizontalX + verticalX,
    }),
    [horizontalX, horizontalY, verticalX]
  );

  return (
    <animated.mesh
      position-y={spring.y}
      position-x={spring.x}
      rotation-x={-Math.PI / 2}
    >
      <mesh rotation-x={-Math.PI / 2}>
        <mesh
          visible={meshVisible.includes(pathname)}
          geometry={stabilizer.geometry}
        >
          <animated.meshStandardMaterial
            color="white"
            metalness={0.5}
            transparent
            opacity={opacity}
            side={DoubleSide}
          />
        </mesh>
        <Elevator opacity={opacity} stabilizer={stabilizer} />
        <mesh scale-z={-1}>
          <Elevator opacity={opacity} stabilizer={stabilizer} />
        </mesh>
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
