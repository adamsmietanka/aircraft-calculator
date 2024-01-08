import ProfileReynolds from "../ProfileReynolds";
import { animated } from "@react-spring/three";
import Inputs3D from "../../common/three/Inputs3D";
import ProfileChoose from "../ProfileChoose";
import LineChart from "../../common/three/LineChart";
import useProfileCharts, {
  useProfileChartsStore,
} from "../hooks/useProfileCharts";
import { useWingStore } from "../stores/useWing";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import { ElementProps } from "../../navigation/Route";
import useProfileAnimation from "./tutorials/hooks/useProfileAnimation";
import { useProfileCoefficientsStore } from "../stores/useProfileCoefficients";

const Profile = ({ opacity, visible }: ElementProps) => {
  const profile = useWingStore((state) => state.profile);
  const profileCl = useProfileCoefficientsStore((state) => state.cl);
  const profileCd = useProfileCoefficientsStore((state) => state.cd);

  useProfileCharts();

  useProfileAnimation(visible);

  return (
    <animated.mesh position-z={0}>
      <Inputs3D gridPositionX={-1.4}>
        <div className="w-72 space-y-2 -mt-8">
          <ProfileChoose />
          <ProfileReynolds />
        </div>
      </Inputs3D>
      <LineChart
        width={0.35}
        gridPositionX={0.35}
        opacity={opacity}
        name="Coefficient of Lift"
        traces={[{ name: "Power", points: profileCl }]}
        axes={{
          x: {
            symbol: (
              <HoverableFormulaSimple
                className="text-lg tooltip-right"
                name="Angle of attack"
                tex="\alpha"
                texHover="\alpha \: [\degree]"
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
                tex="C_L"
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
        gridPositionX={1.2}
        opacity={opacity}
        name="Coefficient of Drag"
        traces={[{ name: "Power", points: profileCd }]}
        axes={{
          x: {
            symbol: (
              <HoverableFormulaSimple
                className="text-lg tooltip-right"
                name="Coefficient of Drag"
                tex="C_D"
              />
            ),
            name: "Coefficient of Drag (Cd)",
            min: 0,
            max: profile.length === 2 ? 0.2 : 0.035,
          },
          y: {
            symbol: (
              <HoverableFormulaSimple
                className="text-lg"
                name="Coefficient of Lift"
                tex="C_L"
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
