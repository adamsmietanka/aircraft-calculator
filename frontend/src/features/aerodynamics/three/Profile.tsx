import ProfileReynolds from "../ProfileReynolds";
import ProfileVisualizer from "./ProfileVisualizer";
import { animated } from "@react-spring/three";
import Inputs3D from "../../common/three/Inputs3D";
import ProfileChoose from "../ProfileChoose";
import LineChart from "../../common/three/LineChart";
import useProfileCharts from "../hooks/useProfileCharts";

const Profile = () => {
  const { pointsCl, pointsCd, useProfileChartsStore } = useProfileCharts();

  return (
    <animated.mesh position-z={0}>
      <Inputs3D gridPositionX={-1}>
        <ProfileChoose />
        <ProfileReynolds />
      </Inputs3D>
      <ProfileVisualizer
        size={[0.33, 1]}
        gridPositionX={-1.33}
      />
      <LineChart
        size={[0.33, 1]}
        gridPositionX={1}
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
