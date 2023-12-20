import ProfileReynolds from "../ProfileReynolds";
import { animated } from "@react-spring/three";
import Inputs3D from "../../common/three/Inputs3D";
import ProfileChoose from "../ProfileChoose";
import LineChart from "../../common/three/LineChart";
import useProfileCharts from "../hooks/useProfileCharts";
import { useWingStore } from "../stores/useWing";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import { ElementProps } from "../../navigation/Route";
import useSubs from "../../common/subtitles/hooks/useSubs";
import { useLevelFlightStore } from "./tutorials/stores/useLevelFlight";
import { useHoverProfileStore } from "../stores/useHoverProfile";
import useAnimation from "../../common/subtitles/hooks/useAnimation";
import { useNavigationStore } from "../../navigation/useNavigation";
import { useSubtitleStore } from "../../common/subtitles/stores/useSubtitles";

const Profile = ({ opacity, visible }: ElementProps) => {
  const { profileCl, profileCd, useProfileChartsStore } = useProfileCharts();
  const profile = useWingStore((state) => state.profile);
  const presentation = useNavigationStore((state) => state.presentation);
  const setAnimation = useSubtitleStore((state) => state.set);

  const { waitForClick: wait } = useSubs();
  const setFormula = useLevelFlightStore((state) => state.set);
  const set = useHoverProfileStore((state) => state.set);
  const setChart = useProfileChartsStore((state) => state.set);

  const setProfile = useWingStore((state) => state.setProfile);

  const animation = async () => {
    await wait(0);
    await wait(0);
    setAnimation({ slowdown: true });
    setProfile("4412");
    await wait(0);
    setProfile("2412");
    await wait(2500);
    setChart({
      yHover: useProfileChartsStore.getState().y["Coefficient of Lift"],
      locked: "Coefficient of Drag",
    });
    setProfile("4412");
    await wait(0);
    setProfile("2412");
    await wait(2000);
    setAnimation({ slowdown: false });
  };

  const cleanup = () => {
    set({ showWeight: false, mass: 0.5, speed: 1 });
    setFormula({ show: false, expand: false, rearrange: false });
  };

  presentation && useAnimation(animation, cleanup, () => {}, visible);

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
            max: profile.length === 2 ? 0.2 : 0.03,
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
