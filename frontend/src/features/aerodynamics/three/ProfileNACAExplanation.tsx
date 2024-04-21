import { Plane } from "@react-three/drei";
import AnimatedHtml from "../../common/three/AnimatedHtml";
import AnimatedInputTechnical from "../../common/drawings/AnimatedInputTechnical";
import Formula from "../../common/Formula";
import AnimatedLine from "../../common/three/AnimatedLine";
import { SpringValue } from "@react-spring/three";
import { useProfileChartsStore } from "../hooks/useProfileCharts";
import useWingScale from "../hooks/useWingScale";
import { useHoverProfileStore } from "../stores/useHoverProfile";
import { useLocation } from "react-router-dom";
import { useProfileStore } from "../stores/useProfile";
import NACA4Hoverables from "./NACA4Hoverables";
import NACA5Hoverables from "./NACA5Hoverables";

interface Props {
  opacity?: SpringValue<number>;
}

const ProfileNACAExplanation = ({ opacity }: Props) => {
  const hoverChart = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);
  const { pathname } = useLocation();

  const onProfile = pathname === "/aerodynamics/profile";

  const hoverPlane = useHoverProfileStore((state) => state.hoverPlane);
  const set = useHoverProfileStore((state) => state.set);
  const hover = useHoverProfileStore((state) => state.hover);

  const show = !(!!locked || hoverChart);

  const { scaleProfile } = useWingScale();

  const prof = useProfileStore((state) => state.prof);

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
          (!onProfile || show) &&
          (hoverPlane || Object.values(hover).some((i) => i))
        }
      >
        {prof.name.length === 4 ? (
          <NACA4Hoverables onProfile={onProfile} />
        ) : (
          <NACA5Hoverables onProfile={onProfile} />
        )}
      </AnimatedHtml>
      <mesh
        visible={hoverPlane || Object.values(hover).some((i) => i)}
        position-z={0.005}
      >
        <AnimatedInputTechnical
          scale={scaleProfile}
          visible={hover.Y || hover.X}
          distance={-2}
          value={1}
          opacity={0.75}
        >
          <Formula
            className={`text-xl ${hover.Y || hover.X || "hidden"}`}
            tex="1"
          />
        </AnimatedInputTechnical>
        <AnimatedInputTechnical
          visible={hover.Y}
          scale={scaleProfile}
          distance={0.25}
          value={prof.M}
          valueY={-prof.P}
          opacity={0.75}
          vertical
        >
          <div className={`flex text-xl ${hover.Y || "hidden"}`}>
            <Formula className={`${prof.M === 0 && "hidden"}`} tex="0.0" />
            <Formula className="text-error" tex={`${prof.M * 100}`} />
          </div>
        </AnimatedInputTechnical>
        <AnimatedInputTechnical
          visible={hover.X}
          distance={-1.25}
          value={prof.P}
          valueY={prof.M}
          opacity={0.75}
        >
          <div className={`flex text-xl ${hover.X || "hidden"}`}>
            <Formula className={`${prof.P === 0 && "hidden"}`} tex="0." />
            <Formula className="text-error" tex={`${prof.P * 10}`} />
          </div>
        </AnimatedInputTechnical>
        <mesh visible={hover.T}>
          <mesh position-x={prof.F}>
            <AnimatedInputTechnical
              distance={-0.7 * scaleProfile - 0.6}
              value={prof.max[1].y - prof.max[0].y}
              startX={prof.max[0].y}
              opacity={0.75}
              vertical
            >
              <div className={`flex text-xl ${hover.T || "hidden"}`}>
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
            <div className={`flex text-xl ${hover.T || "hidden"}`}>
              <Formula tex={`${prof.F}`} />
            </div>
          </AnimatedInputTechnical>
        </mesh>
      </mesh>
    </mesh>
  );
};

export default ProfileNACAExplanation;
