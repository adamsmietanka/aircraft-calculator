import { SpringValue } from "@react-spring/three";
import { useWingStore } from "../stores/useWing";
import { useHoverables, useHoverWingStore } from "../hooks/useHoverables";
import HoverableFormula from "../../common/HoverableFormula";
import AnimatedHtml from "../../common/three/AnimatedHtml";
import AnimatedLine from "../../common/three/AnimatedLine";
import { useGlobalUnitsStore } from "../../settings/stores/useGlobalUnits";
import { unitDisplay, unitMultipliers } from "../../settings/data/units";

interface Props {
  scale: SpringValue<number>;
}

const WingHoverables = ({ scale }: Props) => {
  const wing = useWingStore();
  const hoverStore = useHoverWingStore();

  const { shape } = useHoverables();

  const length = useGlobalUnitsStore((state) => state.types.length);
  const areaUnit = useGlobalUnitsStore((state) => state.types.area);

  return (
    <>
      <mesh visible={hoverStore.surface}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color="green" transparent opacity={0.5} />
      </mesh>
      <mesh position-x={wing.MACposition[0]} visible={hoverStore.MAC}>
        <mesh position-y={wing.MACposition[1]}>
          <AnimatedLine
            points={[
              [0, 0, 0],
              [wing.MAC, 0, 0],
            ]}
            color="gray"
          />
        </mesh>
        <AnimatedLine
          points={[
            [0, wing.span / 2, 0],
            [wing.MAC, wing.span / 2, 0],
            [wing.MAC, -wing.span / 2, 0],
            [0, -wing.span / 2, 0],
            [0, wing.span / 2, 0],
          ]}
          color="gray"
          style="dotted"
        />
      </mesh>
      <AnimatedHtml
        position-y={scale.to((s) => -5 / s)}
        position-x={scale.to((s) => -2 / s)}
        scale={scale.to((s) => 1 / s)}
      >
        <div className="text-2xl space-y-3">
          <HoverableFormula
            name="Aspect Ratio"
            tex={`AR=${wing.aspectRatio.toFixed(2)}`}
            texHover="AR=\frac{\color{red}b^2}{\color{green}S}"
            hover={hoverStore.b}
            onEnter={() => hoverStore.set({ surface: true, b: true })}
            onLeave={() => hoverStore.set({ surface: false, b: false })}
            center
          />
          <HoverableFormula
            name="Taper Ratio"
            tex={`\\large\\lambda\\normalsize=${wing.taperRatio.toFixed(2)}`}
            texHover="\large\lambda \normalsize = \frac {\color{orange} c_t} {\color{green} c}"
            hover={hoverStore.chords}
            onEnter={() => hoverStore.set({ chords: true })}
            onLeave={() => hoverStore.set({ chords: false })}
          />
          <HoverableFormula
            name="Wing Surface"
            tex={`S=${(wing.area / unitMultipliers.area[areaUnit]).toFixed(
              2
            )}\\, ${unitDisplay.area[areaUnit]}`}
            texHover={` \\textcolor{green}{S}=${(
              wing.area / unitMultipliers.area[areaUnit]
            ).toFixed(2)}\\, ${unitDisplay.area[areaUnit]}`}
            hover={hoverStore.surface}
            onEnter={() => hoverStore.set({ surface: true })}
            onLeave={() => hoverStore.set({ surface: false })}
          />
          <HoverableFormula
            name="Mean Aerodynamic Chord"
            tex={`MAC=${(wing.MAC / unitMultipliers.length[length]).toFixed(
              2
            )}\\, ${unitDisplay.length[length]}`}
            texHover={` \\textcolor{gray}{MAC}=${(
              wing.MAC / unitMultipliers.length[length]
            ).toFixed(2)}\\, ${unitDisplay.length[length]}`}
            hover={hoverStore.MAC}
            onEnter={() => hoverStore.set({ MAC: true })}
            onLeave={() => hoverStore.set({ MAC: false })}
          />
        </div>
      </AnimatedHtml>
    </>
  );
};

export default WingHoverables;
