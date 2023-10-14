import ProfileReynolds from "../ProfileReynolds";
import { SpringValue, animated } from "@react-spring/three";
import Inputs3D from "../../common/three/Inputs3D";
import ProfileChoose from "../ProfileChoose";
import LineChart from "../../common/three/LineChart";
import useProfileCharts from "../hooks/useProfileCharts";
import { useWingStore } from "../stores/useWing";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";

interface Props {
  opacity: SpringValue<number>;
}

const Profile = ({ opacity }: Props) => {
  const { pointsCl, pointsCd, useProfileChartsStore } = useProfileCharts();
  const profile = useWingStore((state) => state.profile);

  return (
    <animated.mesh position-z={0}>
      <Inputs3D gridPositionX={-1.3}>
        <div className="w-72 space-y-2 -mt-8">
          <ProfileChoose />
          <ProfileReynolds />
        </div>
      </Inputs3D>
      <LineChart
        width={0.33}
        gridPositionX={0.25}
        opacity={opacity}
        name="Coefficient of Lift"
        traces={[{ name: "Power", points: pointsCl }]}
        axes={{
          x: {
            symbol: (
              <HoverableFormulaSimple
                className="text-lg"
                name="Angle of attack"
                tex={`\\alpha`}
                texHover={`\\alpha \\: [\\degree]`}
              />
            ),
            name: "Angle of Attack",
            min: -20,
            max: 20,
          },
          y: {
            symbol: (
              <HoverableFormulaSimple
                className="text-lg"
                name="Coefficient of Lift"
                tex={`C_L`}
              />
            ),
            name: "Coefficient of Lift (Cl)",
            min: -1.75,
            max: 1.75,
          },
        }}
        store={useProfileChartsStore}
      />
      <LineChart
        width={0.5}
        gridPositionX={1.1}
        opacity={opacity}
        name="Coefficient of Drag"
        traces={[{ name: "Power", points: pointsCd }]}
        axes={{
          x: {
            symbol: (
              <HoverableFormulaSimple
                className="text-lg"
                name="Coefficient of Drag"
                tex={`C_D`}
              />
            ),
            name: "Coefficient of Drag (Cd)",
            min: 0,
            max: profile.length === 2 ? 0.2 : 0.026,
          },
          y: {
            symbol: (
              <HoverableFormulaSimple
                className="text-lg"
                name="Coefficient of Lift"
                tex={`C_L`}
              />
            ),
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
