import AnimatedInputTechnical from "../../common/drawings/AnimatedInputTechnical";
import { usePlaneStore } from "../stores/usePlane";
import { Props } from "../../common/types/three";
import InputDrawing from "../../common/inputs/InputDrawing";
import { useLocation } from "react-router-dom";
import { useVerticalStore } from "../stores/useVertical";
import useVertical from "./hooks/useVertical";
import AnimatedLine from "../../common/three/AnimatedLine";
import { Edges } from "@react-three/drei";
import { useCSSColors } from "../../common/three/config";

const StabilizerVertical = ({ opacity }: Props) => {
  const chord = useVerticalStore((state) => state.chord);
  const chordTip = useVerticalStore((state) => state.chordTip);
  const setChord = useVerticalStore((state) => state.setChord);
  const setChordTip = useVerticalStore((state) => state.setChordTip);

  const shape = useVerticalStore((state) => state.shape);

  const verticalToTail = usePlaneStore((state) => state.verticalToTail);
  const length = usePlaneStore((state) => state.length);

  const setVerticalToTail = usePlaneStore((state) => state.setVerticalToTail);

  const { pathname } = useLocation();
  const { gridColor } = useCSSColors();

  const { vertical, leading, trailing, top } = useVertical();

  return (
    <group>
      {/* <mesh rotation-x={-Math.PI / 2} geometry={vertical}>
        <animated.meshStandardMaterial
          color="white"
          metalness={0.5}
          transparent
          opacity={opacity}
          // wireframe
        />
        <Edges color={gridColor} />
      </mesh> */}
      <AnimatedInputTechnical
        visible={pathname === "/aerodynamics/vertical"}
        distance={1}
        value={chord}
        opacity={opacity.to((o) => 0.75 * o)}
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
      {/* <AnimatedInputTechnical
        visible={pathname === "/aerodynamics/vertical"}
        distance={2}
        value={chordTip}
        startX={-wingX}
        opacity={opacity.to((o) => 0.75 * o)}
      >
        <InputDrawing value={chordTip} setter={setChordTip} />
      </AnimatedInputTechnical> */}

      {/* <AnimatedInputTechnical
        visible={pathname === "/aerodynamics/vertical"}
        distance={1.25}
        value={wingX}
        startX={-wingX}
        opacity={opacity.to((o) => 0.75 * o)}
      >
        <InputDrawing value={wingX} setter={setWingX} />
      </AnimatedInputTechnical> */}
      <AnimatedLine points={leading} color="grid" opacity={opacity} />
      <AnimatedLine points={trailing} color="grid" opacity={opacity} />
      <AnimatedLine points={top} color="grid" opacity={opacity} />
    </group>
  );
};

export default StabilizerVertical;
