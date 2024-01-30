import AnimatedInputTechnical from "../../common/drawings/AnimatedInputTechnical";
import { usePlaneStore } from "../stores/usePlane";
import { Props } from "../../common/types/three";
import InputDrawing from "../../common/inputs/InputDrawing";
import { useLocation } from "react-router-dom";
import { useVerticalStore } from "../stores/useVertical";
import useVertical from "./hooks/useVertical";
import AnimatedLine from "../../common/three/AnimatedLine";
import { getXTip } from "./hooks/useWingSpring";
import { animated } from "@react-spring/three";
import { isMultifuse } from "../utils/planeConfiguration";

const meshVisible = ["/aerodynamics/horizontal", "/aerodynamics/results"];

const StabilizerVertical = ({ opacity }: Props) => {
  const chord = useVerticalStore((state) => state.chord);
  const span = useVerticalStore((state) => state.span);
  const angle = useVerticalStore((state) => state.angle);
  const chordTip = useVerticalStore((state) => state.chordTip);
  const setSpan = useVerticalStore((state) => state.setSpan);
  const setChord = useVerticalStore((state) => state.setChord);
  const setChordTip = useVerticalStore((state) => state.setChordTip);

  const shape = useVerticalStore((state) => state.shape);

  const verticalToTail = usePlaneStore((state) => state.verticalToTail);
  const length = usePlaneStore((state) => state.length);
  const configuration = usePlaneStore((state) => state.configuration);
  const fuselageDistance = usePlaneStore((state) => state.fuselageDistance);

  const setVerticalToTail = usePlaneStore((state) => state.setVerticalToTail);

  const { pathname } = useLocation();

  const { vertical, leading, trailing, top } = useVertical();

  return (
    <mesh>
      <mesh
        visible={meshVisible.includes(pathname)}
        rotation-x={-Math.PI / 2}
        geometry={vertical}
      >
        <animated.meshStandardMaterial
          color="white"
          metalness={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh
        visible={meshVisible.includes(pathname) && isMultifuse(configuration)}
        rotation-x={-Math.PI / 2}
        position-z={-fuselageDistance}
        geometry={vertical}
      >
        <animated.meshStandardMaterial
          color="white"
          metalness={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>
      <AnimatedInputTechnical
        visible={pathname === "/aerodynamics/vertical"}
        distance={1}
        value={chord}
        opacity={opacity.to((o) => 0.75 * o)}
        outside
      >
        <InputDrawing value={chord} setter={setChord} />
      </AnimatedInputTechnical>
      <mesh rotation-x={(120 * Math.PI) / 180}>
        <AnimatedInputTechnical
          visible={pathname === "/aerodynamics/vertical"}
          distance={1}
          value={verticalToTail}
          opacity={opacity.to((o) => 0.75 * o)}
        >
          <div className="transform scale-y-[-1]">
            <InputDrawing
              value={verticalToTail}
              setter={setVerticalToTail}
              min={chord}
              max={length / 2}
            />
          </div>
        </AnimatedInputTechnical>
      </mesh>
      <mesh rotation-z={(90 * Math.PI) / 180}>
        <AnimatedInputTechnical
          visible={pathname === "/aerodynamics/vertical"}
          distance={1}
          valueY={shape === 2 ? -0.7 * chord : -getXTip(angle, span)}
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
        visible={pathname === "/aerodynamics/vertical" && shape === 1}
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
          pathname === "/aerodynamics/vertical"
        }
      >
        <AnimatedLine points={leading} color="grid" opacity={opacity} />
        <AnimatedLine points={trailing} color="grid" opacity={opacity} />
        <AnimatedLine points={top} color="grid" opacity={opacity} />
        <AnimatedLine
          points={[
            [0, 0, 0],
            [chord, 0, 0],
          ]}
          color="grid"
          opacity={opacity}
        />
      </mesh>
      <mesh
        visible={
          (pathname === "/aerodynamics/fuselage" ||
            pathname === "/aerodynamics/vertical") &&
          isMultifuse(configuration)
        }
        position-z={-fuselageDistance}
      >
        <AnimatedLine points={leading} color="grid" opacity={opacity} />
        <AnimatedLine points={trailing} color="grid" opacity={opacity} />
        <AnimatedLine points={top} color="grid" opacity={opacity} />
        <AnimatedLine
          points={[
            [0, 0, 0],
            [chord, 0, 0],
          ]}
          color="grid"
          opacity={opacity}
        />
      </mesh>
    </mesh>
  );
};

export default StabilizerVertical;
