import { useWingStore } from "../stores/useWing";
import AnimatedHtml from "./AnimatedHtml";
import Formula from "../../common/Formula";
import { animated, SpringValue } from "@react-spring/three";
import useWingAerodynamics from "../hooks/useWingAerodynamics";
import { create } from "zustand";
import { useLocation } from "react-router-dom";
import Line from "../../common/three/Line";
import useHoverables from "../hooks/useHoverables";

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
          <div
            className="tooltip tooltip-top flex items-start h-10 text-3xl"
            data-tip="Aspect Ratio"
          >
            <Formula
              className="flex items-center h-10 text-3xl"
              tex={`\\Lambda=${
                hoverStore.b
                  ? " \\frac{\\color{red}b^2}{\\color{green}S}"
                  : aspectRatio.toFixed(2)
              }`}
              onPointerEnter={() => hoverStore.set({ surface: true, b: true })}
              onPointerLeave={() =>
                hoverStore.set({ surface: false, b: false })
              }
            />
          </div>
          <div
            className="tooltip tooltip-top flex items-start h-10 text-3xl"
            data-tip="Taper Ratio"
          >
            <Formula
              tex={`\\large\\lambda\\normalsize=${
                hoverStore.chords
                  ? " \\frac{\\color{orange}c_t}{\\color{green}c}"
                  : taperRatio.toFixed(2)
              }`}
              onPointerEnter={() => hoverStore.set({ chords: true })}
              onPointerLeave={() => hoverStore.set({ chords: false })}
            />
          </div>
          <div className="tooltip tooltip-top flex" data-tip="Wing Surface">
            <Formula
              className="text-2xl"
              tex={`S=${area.toFixed(2)}\\, m^2`}
              onPointerEnter={() => hoverStore.set({ surface: true })}
              onPointerLeave={() => hoverStore.set({ surface: false })}
            />
          </div>
          <div
            className="tooltip tooltip-bottom"
            data-tip="Mean aerodynamic chord"
          >
            <Formula
              className="text-2xl mt-1"
              tex={`MAC=${meanAerodynamicChord.toFixed(2)}\\, m`}
              onPointerEnter={() => hoverStore.set({ MAC: true })}
              onPointerLeave={() => hoverStore.set({ MAC: false })}
            />
          </div>
        </AnimatedHtml>
      </animated.mesh>
    </>
  );
};

export default WingHoverables;
