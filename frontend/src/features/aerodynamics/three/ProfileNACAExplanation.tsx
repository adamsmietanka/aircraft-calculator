import { Plane } from "@react-three/drei";
import AnimatedHtml from "../../common/three/AnimatedHtml";
import { SpringValue } from "@react-spring/three";
import { useProfileChartsStore } from "../hooks/useProfileCharts";
import { useHoverProfileStore } from "../stores/useHoverProfile";
import { useLocation } from "react-router-dom";
import { useProfileStore } from "../stores/useProfile";
import NACA4Hoverables from "./NACA4Hoverables";
import NACA5Hoverables from "./NACA5Hoverables";
import ProfileThickness from "./profile/ProfileThickness";
import ProfileCamber from "./profile/ProfileCamber";
import ProfileCl from "./profile/ProfileCl";

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

  const show = !locked;

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
        <ProfileCamber />
        <ProfileThickness />
        <ProfileCl />
      </mesh>
    </mesh>
  );
};

export default ProfileNACAExplanation;
