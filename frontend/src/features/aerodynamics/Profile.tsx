import { Canvas } from "@react-three/fiber";
import LineChart from "../common/three/LineChart";
import ProfileVisualizer from "./three/ProfileVisualizer";
import useProfileCharts from "./hooks/useProfileCharts";
import ProfileChoose from "./ProfileChoose";
import ProfileReynolds from "./ProfileReynolds";
import ProfileModal from "./ProfileModal";
import { OrbitControls } from "@react-three/drei";
import Inputs3D from "../common/three/Inputs3D";

const Profile = () => {
  const { pointsCl, pointsCd, useProfileChartsStore } = useProfileCharts();

  return (
    <div className="flex space-x-4 h-full p-6">
      <div className="flex w-full">
        <div className="fixed top-0 left-0 h-screen w-screen">
          <ProfileModal />
          <Canvas camera={{ position: [0, 0, 30], fov: 40 }}>
            {/* <gridHelper rotation-x={Math.PI / 2} /> */}
            <Inputs3D size={[0.33, 1]} gridPositionX={-3}>
              <ProfileChoose />
              <ProfileReynolds />
            </Inputs3D>
            <OrbitControls />
            <ProfileVisualizer size={[0.33, 1]} gridPositionX={-1} />
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
              size={[0.33, 1]}
              gridPositionX={3}
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
