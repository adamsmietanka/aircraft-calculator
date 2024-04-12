import { Plane } from "@react-three/drei";
import AnimatedHtml from "../../common/three/AnimatedHtml";
import AnimatedInputTechnical from "../../common/drawings/AnimatedInputTechnical";
import Formula from "../../common/Formula";
import HoverableFormulaColor from "../../common/HoverableFormulaColor";
import AnimatedLine from "../../common/three/AnimatedLine";
import { SpringValue } from "@react-spring/three";
import { useProfileChartsStore } from "../hooks/useProfileCharts";
import useWingScale from "../hooks/useWingScale";
import { useHoverProfileStore } from "../stores/useHoverProfile";
import { useLocation } from "react-router-dom";
import { useProfileStore } from "../stores/useProfile";

interface Props {
  opacity?: SpringValue<number>;
}

/**
 * Used to align latex symbols with surroundings
 * @param inside the text to be hidden
 * @returns text wrapped with vphantom
 */
const phantom = (inside: string) => `\\vphantom{${inside}}`;

const ProfileNACAExplanation = ({ opacity }: Props) => {
  const hover = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);
  const { pathname } = useLocation();

  const onProfile = pathname === "/aerodynamics/profile";

  const hoverPlane = useHoverProfileStore((state) => state.hoverPlane);
  const hoverA = useHoverProfileStore((state) => state.hoverA);
  const hoverB = useHoverProfileStore((state) => state.hoverB);
  const hoverC = useHoverProfileStore((state) => state.hoverC);
  const set = useHoverProfileStore((state) => state.set);

  const show = !(!!locked || hover);

  const { scaleProfile } = useWingScale();

  const prof = useProfileStore((state) => state.prof);


  const first = `${prof.M * 100}`;
  const second = `${prof.P * 10}`;
  const third = `${String(prof.T * 100).padStart(2, "0")}`;
  return (
    <mesh>
      <Plane
        args={[1.1, 0.5]}
        position-x={0.5}
        position-y={0.1}
        material-transparent
        material-opacity={0}
        onPointerMove={(e) => {}}
        onPointerEnter={(e) => onProfile && set({ hoverPlane: true })}
        onPointerLeave={(e) => onProfile && set({ hoverPlane: false })}
        onClick={(e) => {}}
        visible={false}
      />
      <AnimatedHtml
        position-x={0.5}
        position-y={0.25}
        show={
          (!onProfile || show) && (hoverPlane || hoverA || hoverB || hoverC)
        }
      >
        <div className="flex text-3xl">
          <HoverableFormulaColor
            name="Maximum camber of the airfoil"
            tex={first + phantom(second + third)}
            hover={hoverA}
            onEnter={() => onProfile && set({ hoverA: true })}
            onLeave={() => onProfile && set({ hoverA: false })}
          />
          <HoverableFormulaColor
            name="Position of maximum camber"
            tex={phantom(first) + second + phantom(third)}
            hover={hoverB}
            onEnter={() => onProfile && set({ hoverB: true })}
            onLeave={() => onProfile && set({ hoverB: false })}
          />
          <HoverableFormulaColor
            name="Maximum thickness of the airfoil"
            tex={phantom(first + second) + third}
            hover={hoverC}
            onEnter={() => onProfile && set({ hoverC: true })}
            onLeave={() => onProfile && set({ hoverC: false })}
          />
        </div>
      </AnimatedHtml>
      <mesh
        visible={hoverPlane || hoverA || hoverB || hoverC}
        position-z={0.005}
      >
        <AnimatedInputTechnical
          scale={scaleProfile}
          visible={hoverA || hoverB}
          distance={-2}
          value={1}
          opacity={0.75}
        >
          <Formula
            className={`text-xl ${hoverA || hoverB || "hidden"}`}
            tex="1"
          />
        </AnimatedInputTechnical>
        <AnimatedInputTechnical
          visible={hoverA}
          scale={scaleProfile}
          distance={0.25}
          value={prof.M}
          valueY={-prof.P}
          opacity={0.75}
          vertical
        >
          <div className={`flex text-xl ${hoverA || "hidden"}`}>
            <Formula className={`${prof.M === 0 && "hidden"}`} tex="0.0" />
            <Formula className="text-error" tex={`${prof.M * 100}`} />
          </div>
        </AnimatedInputTechnical>
        <AnimatedInputTechnical
          visible={hoverB}
          distance={-1.25}
          value={prof.P}
          valueY={prof.M}
          opacity={0.75}
        >
          <div className={`flex text-xl ${hoverB || "hidden"}`}>
            <Formula className={`${prof.P === 0 && "hidden"}`} tex="0." />
            <Formula className="text-error" tex={`${prof.P * 10}`} />
          </div>
        </AnimatedInputTechnical>
        <mesh visible={hoverC}>
          <mesh position-x={prof.F}>
            <AnimatedInputTechnical
              distance={-0.7 * scaleProfile - 0.6}
              value={prof.max[1].y - prof.max[0].y}
              startX={prof.max[0].y}
              opacity={0.75}
              vertical
            >
              <div className={`flex text-xl ${hoverC || "hidden"}`}>
                <Formula tex="0." />
                <Formula
                  className="text-error"
                  tex={`${String(prof.T * 100).padStart(2, "0")}`}
                />
              </div>
            </AnimatedInputTechnical>
            <AnimatedLine
              points={[
                [0, prof.max[0].y, 0],
                [0, prof.max[1].y, 0],
              ]}
              opacity={0.75}
              width={1.5}
              color="secondary"
              segments
            />
          </mesh>
          <AnimatedInputTechnical
            distance={-1.25}
            value={prof.F}
            valueY={prof.max[0].y}
            opacity={0.75}
          >
            <div className={`flex text-xl ${hoverC || "hidden"}`}>
              <Formula tex={`${prof.F}`} />
            </div>
          </AnimatedInputTechnical>
        </mesh>
      </mesh>
    </mesh>
  );
};

export default ProfileNACAExplanation;
