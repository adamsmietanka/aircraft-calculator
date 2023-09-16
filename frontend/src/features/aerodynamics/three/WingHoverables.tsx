import { Html } from "@react-three/drei";
import { animated, SpringValue } from "@react-spring/three";
import { useWingStore } from "../stores/useWing";
import useWingAerodynamics from "../hooks/useWingAerodynamics";
import { useHoverables, useHoverWingStore } from "../hooks/useHoverables";
import Line from "../../common/three/Line";
import HoverableFormula from "../../common/HoverableFormula";

interface Props {
  scale: SpringValue<number>;
}

const WingHoverables = ({ scale }: Props) => {
  const wing = useWingStore();
  const hoverStore = useHoverWingStore();

  const { area, aspectRatio, taperRatio, meanAerodynamicChord, MACposition } =
    useWingAerodynamics();

  const { shape } = useHoverables();

  return (
    <>
      <mesh visible={hoverStore.surface}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color="green" transparent opacity={0.5} />
      </mesh>
      <mesh position-x={MACposition[0]} visible={hoverStore.MAC}>
        <mesh position-y={MACposition[1]}>
          <Line
            trace={{
              name: "Outline",
              points: [
                [0, 0, 0],
                [1, 0, 0],
              ],
            }}
            scale={[meanAerodynamicChord, 1, 1]}
            color="gray"
          />
        </mesh>
        <Line
          trace={{
            name: "Outline",
            points: [
              [0, wing.span / 2, 0],
              [1, wing.span / 2, 0],
              [1, -wing.span / 2, 0],
              [0, -wing.span / 2, 0],
              [0, wing.span / 2, 0],
            ],
          }}
          scale={[meanAerodynamicChord, 1, 1]}
          color="gray"
          style="dotted"
        />
      </mesh>
      <animated.mesh
        position-y={scale.to((s) => -5 / s)}
        position-x={scale.to((s) => -2 / s)}
        scale={scale.to((s) => 1 / s)}
      >
        <Html className="text-2xl space-y-3" transform>
          <HoverableFormula
            name="Aspect Ratio"
            tex={`\\Lambda=${aspectRatio.toFixed(2)}`}
            texHover={`\\Lambda=\\frac{\\color{red}b^2}{\\color{green}S}`}
            hover={hoverStore.b}
            onEnter={() => hoverStore.set({ surface: true, b: true })}
            onLeave={() => hoverStore.set({ surface: false, b: false })}
            center
          />
          <HoverableFormula
            name="Taper Ratio"
            tex={`\\large\\lambda\\normalsize=${taperRatio.toFixed(2)}`}
            texHover={`\\large\\lambda\\normalsize= \\frac{\\color{orange}c_t}{\\color{green}c}`}
            hover={hoverStore.chords}
            onEnter={() => hoverStore.set({ chords: true })}
            onLeave={() => hoverStore.set({ chords: false })}
          />
          <HoverableFormula
            name="Wing Surface"
            tex={`S=${area.toFixed(2)}\\, m^2`}
            texHover={` \\textcolor{green}{S}=${area.toFixed(2)}\\, m^2`}
            hover={hoverStore.surface}
            onEnter={() => hoverStore.set({ surface: true })}
            onLeave={() => hoverStore.set({ surface: false })}
          />
          <HoverableFormula
            name="Mean Aerodynamic Chord"
            tex={`MAC=${meanAerodynamicChord.toFixed(2)}\\, m`}
            texHover={` \\textcolor{gray}{MAC}=${meanAerodynamicChord.toFixed(
              2
            )}\\, m`}
            hover={hoverStore.MAC}
            onEnter={() => hoverStore.set({ MAC: true })}
            onLeave={() => hoverStore.set({ MAC: false })}
          />
        </Html>
      </animated.mesh>
    </>
  );
};

export default WingHoverables;
