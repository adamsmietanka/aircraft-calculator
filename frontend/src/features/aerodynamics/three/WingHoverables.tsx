import { useWingStore } from "../stores/useWing";
import AnimatedHtml from "./AnimatedHtml";
import Formula from "../../common/Formula";
import { animated, SpringValue } from "@react-spring/three";
import useWingAerodynamics from "../hooks/useWingAerodynamics";
import { create } from "zustand";
import { useLocation } from "react-router-dom";
import Line from "../../common/three/Line";
import useHoverables from "../hooks/useHoverables";
import HoverableFormula from "../../common/HoverableFormula";

export interface HoverStore {
  surface: boolean;
  b: boolean;
  chords: boolean;
  MAC: boolean;
  set: (value: Partial<HoverStore>) => void;
}

export const useHoverWingStore = create<HoverStore>()((set) => ({
  surface: false,
  b: false,
  chords: false,
  MAC: false,
  set: (value) => set(value),
}));

interface Props {
  scale: SpringValue<number>;
}

const WingHoverables = ({ scale }: Props) => {
  const wing = useWingStore();
  const hoverStore = useHoverWingStore();

  const { area, aspectRatio, taperRatio, meanAerodynamicChord, MACposition } =
    useWingAerodynamics();
  const location = useLocation();

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
        position-y={scale.to((s) => -4 / s)}
        position-x={scale.to((s) => -2 / s)}
        scale={scale.to((s) => 1 / s)}
      >
        <AnimatedHtml
          color={"green"}
          show={location.pathname === "/aerodynamics/wing"}
        >
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
          <div
            className="tooltip tooltip-top flex"
            data-tip="Wing Surface"
            onPointerEnter={() => hoverStore.set({ surface: true })}
            onPointerLeave={() => hoverStore.set({ surface: false })}
          >
            <Formula className="text-2xl" tex={`S=${area.toFixed(2)}\\, m^2`} />
          </div>
          <div
            className="tooltip tooltip-bottom"
            data-tip="Mean aerodynamic chord"
            onPointerEnter={() => hoverStore.set({ MAC: true })}
            onPointerLeave={() => hoverStore.set({ MAC: false })}
          >
            <Formula
              className="text-2xl mt-1"
              tex={`MAC=${meanAerodynamicChord.toFixed(2)}\\, m`}
            />
          </div>
        </AnimatedHtml>
      </animated.mesh>
    </>
  );
};

export default WingHoverables;
