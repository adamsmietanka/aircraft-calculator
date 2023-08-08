import { Canvas } from "@react-three/fiber";
import LineChart from "../common/three/LineChart";
import ProfileVisualizer from "./three/ProfileVisualizer";
import useProfileCharts from "./hooks/useProfileCharts";
import ProfileTable from "./ProfileTable";
import ProfileChoose from "./ProfileChoose";

const Profile = () => {
  const { points, pointsCd, useProfileChartsStore } = useProfileCharts();

  return (
    <div className="flex space-x-4 h-full p-6">
      <div className="flex flex-col">
        <ProfileChoose />
        <div className="relative top-1/4 h-60">
          <Canvas orthographic camera={{ zoom: 30 }}>
            <ProfileVisualizer />
          </Canvas>
        </div>
      </div>
      <div className="flex w-full">
        <div className="sticky top-1/4 h-3/5 w-2/5" style={{ height: "76vh" }}>
          <Canvas orthographic camera={{ zoom: 30 }}>
            <LineChart
              name="Coefficient of Lift"
              traces={[{ name: "Power", points }]}
              axes={{
                x: { name: "Angle of Attack", min: -20, max: 20 },
                y: {
                  name: "Coefficient of Lift (Cl)",
                  min: -1.5,
                  max: 1.5,
                },
              }}
              store={useProfileChartsStore}
            />
          </Canvas>
        </div>
        <div className="sticky top-1/4 h-3/5 w-2/5" style={{ height: "76vh" }}>
          <Canvas orthographic camera={{ zoom: 30 }}>
            <LineChart
              name="Coefficient of Drag"
              traces={[{ name: "Power", points: pointsCd }]}
              axes={{
                x: {
                  name: "Coefficient of Drag (Cd)",
                  min: 0,
                  max: 0.021,
                },
                y: {
                  name: "Cl",
                  min: -1.5,
                  max: 1.5,
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
