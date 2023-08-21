import { Canvas } from "@react-three/fiber";
import LineChart from "../common/three/LineChart";
import ProfileVisualizer from "./three/ProfileVisualizer";
import useProfileCharts from "./hooks/useProfileCharts";
import ProfileChoose from "./ProfileChoose";
import ProfileReynolds from "./ProfileReynolds";
import { OrbitControls } from "@react-three/drei";

const Profile = () => {
  const { pointsCl, pointsCd, useProfileChartsStore } = useProfileCharts();

  return (
    <div className="flex space-x-4 h-full p-6">
      <div className="flex flex-col w-80 space-y-1">
        <ProfileChoose />
        <ProfileReynolds />
      </div>
      <div className="flex w-full">
        <div className="fixed top-0 left-0 h-screen w-screen">
          <Canvas camera={{ position: [0, 0, 15] }}>
            {/* <gridHelper rotation-x={Math.PI / 2} /> */}
            <OrbitControls />
            <ProfileVisualizer size={[0.33, 1]} gridPositionX={-2} />
            <LineChart
              size={[0.33, 1]}
              gridPositionX={0}
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
              size={[0.33, 1]}
              gridPositionX={2}
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
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default Profile;
