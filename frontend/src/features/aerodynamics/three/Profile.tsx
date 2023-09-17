import ProfileReynolds from "../ProfileReynolds";
import ProfileVisualizer from "./ProfileVisualizer";
import { animated, config, useSpring } from "@react-spring/three";
import Inputs3D from "../../common/three/Inputs3D";
import ProfileChoose from "../ProfileChoose";
import LineChart from "../../common/three/LineChart";
import useProfileCharts from "../hooks/useProfileCharts";
import { useLocation } from "react-router-dom";

const Profile = () => {
  const { pointsCl, pointsCd, useProfileChartsStore } = useProfileCharts();
  const location = useLocation();

  const onProfileStep = location.pathname === "/aerodynamics/profile";

  const [s] = useSpring(
    () => ({
      opacity: location.pathname === "/aerodynamics/profile" ? 1 : 0,
      config: config.slow,
    }),
    [location.pathname]
  );
  return (
    <animated.mesh position-z={0}>
      <Inputs3D size={[0.33, 1]} gridPositionX={-3} visible={onProfileStep}>
        <ProfileChoose />
        <ProfileReynolds />
      </Inputs3D>
      <ProfileVisualizer
        size={[0.33, 1]}
        gridPositionX={-1.33}
        opacity={s.opacity}
      />
      <LineChart
        size={[0.33, 1]}
        gridPositionX={1}
        opacity={s.opacity}
        name="Coefficient of Lift"
        traces={[{ name: "Power", points: pointsCl }]}
        axes={{
          x: { name: "Angle of Attack", min: -20, max: 20 },
          y: {
            name: "Coefficient of Lift (Cl)",
            min: -1.75,
            max: 1.75,
          },
        }}
        store={useProfileChartsStore}
      />
      <LineChart
        size={[0.5, 1]}
        gridPositionX={2.2}
        opacity={s.opacity}
        name="Coefficient of Drag"
        traces={[{ name: "Power", points: pointsCd }]}
        axes={{
          x: {
            name: "Coefficient of Drag (Cd)",
            min: 0,
            max: 0.026,
          },
          y: {
            name: "Cl",
            min: -1.75,
            max: 1.75,
          },
        }}
        store={useProfileChartsStore}
        yHover
      />
    </animated.mesh>
  );
};

export default Profile;
