import { Canvas } from "@react-three/fiber";
import LineChart from "../power_unit/three/LineChart";
import ProfileVisualizer from "./three/ProfileVisualizer";
import useProfileCharts from "./hooks/useProfileCharts";
import ProfileTable from "./ProfileTable";

const Profile = () => {
  const { points, pointsCd, useProfileChartsStore } = useProfileCharts();

  return (
    <div className="flex space-x-4 h-full mt-4">
      <div className="flex flex-col">
        <ProfileTable />
        <div className="h-96">
          <Canvas orthographic camera={{ zoom: 30 }}>
            <ProfileVisualizer />
          </Canvas>
        </div>
      </div>
      <div className="flex w-full">
        <div className="sticky top-1/4 h-3/5 w-2/5" style={{ height: "82vh" }}>
          <Canvas orthographic camera={{ zoom: 30 }}>
            <LineChart
              name="Coefficient of Lift"
              traces={[{ name: "Power", points }]}
              axes={{
                x: { name: "Angle of Attack", min: -10, max: 20 },
                y: {
                  name: "Cl",
                  min: -1,
                  max: 1.5,
                },
              }}
              store={useProfileChartsStore}
            />
          </Canvas>
        </div>
        <div className="sticky top-1/4 h-3/5 w-2/5" style={{ height: "82vh" }}>
          <Canvas orthographic camera={{ zoom: 30 }}>
            <LineChart
              name="Coefficient of Drag"
              traces={[{ name: "Power", points: pointsCd }]}
              axes={{
                x: {
                  name: "Coefficient of Lift (Cl)",
                  min: -1.5,
                  max: 1.5,
                },
                y: {
                  name: "Cd",
                  min: 0,
                  max: 0.02,
                },
              }}
              store={useProfileChartsStore}
            />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default Profile;
