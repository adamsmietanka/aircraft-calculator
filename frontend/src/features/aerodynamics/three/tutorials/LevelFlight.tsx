import { useState, useEffect } from "react";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import { useWingStore } from "../../stores/useWing";
import { useProfileChartsStore } from "../../hooks/useProfileCharts";
import { useCameraStore } from "../../../common/three/stores/useCamera";
import Inputs3D from "../../../common/three/Inputs3D";
import MassSlider from "./MassSlider";
import SpeedSlider from "./SpeedSlider";
import LineChart from "../../../common/three/LineChart";
import useProfileTable, { Row } from "../../hooks/useProfileTable";
import HoverableFormulaSimple from "../../../common/HoverableFormulaSimple";
import useSubs from "../../../common/subtitles/hooks/useSubs";
import { useLevelFlightStore } from "./stores/useLevelFlight";
import { ElementProps } from "../../../navigation/Route";
import useAnimation from "../../../common/subtitles/hooks/useAnimation";
import { useProfileCoefficientsStore } from "../../stores/useProfileCoefficients";

const LevelFlight = ({ opacity, visible }: ElementProps) => {
  const profile = useWingStore((state) => state.profile);

  const profileCl = useProfileCoefficientsStore((state) => state.cl);
  const profileCd = useProfileCoefficientsStore((state) => state.cd);

  const reynolds = useWingStore((state) => state.reynolds);

  const mass = useHoverProfileStore((state) => state.mass);
  const setMass = useHoverProfileStore((state) => state.setMass);

  const setFormula = useLevelFlightStore((state) => state.set);
  const set = useHoverProfileStore((state) => state.set);
  const setChart = useProfileChartsStore((state) => state.set);
  const setCamera = useCameraStore((state) => state.set);

  const { maxCz } = useProfileTable(1, profile) as Row;

  useEffect(() => {
    if (visible) {
      // Cause default reynolds is 6
      const speed = reynolds / 6;
      setChart({ yHover: Math.min(maxCz, mass / (speed * speed)) });
      const diff =
        Math.min(maxCz, mass / (speed * speed)) * speed * speed - mass;
      set({ fallVelocity: -diff });
    }
  }, [mass, reynolds, visible]);

  const [showLayout, setShowLayout] = useState(false);

  const { sub } = useSubs();

  const animation = async () => {
    setChart({ hover: true, yHover: 0.5, locked: "Coefficient of Drag" });
    await sub("When we want to maintain level flight");
    await sub(
      "The forces acting in the vertical direction must be equal",
      () => {
        set({ showWeight: true });
        setFormula({ show: true });
      }
    );
    await sub("In order not to fall down", () => setFormula({ expand: true }));
    await sub(
      <>
        We need to keep a specific &nbsp;
        <p className="text-primary">coefficient of lift</p>
      </>,
      () => setFormula({ rearrange: true })
    );
    setFormula({ show: false });
    setCamera({ center: [0, 0, 0], spherical: [20, 90, 0] });
    setShowLayout(true);
  };

  const cleanup = () => {
    set({ showWeight: false, mass: 0.5, speed: 1 });
    setFormula({ show: false, expand: false, rearrange: false });
    setShowLayout(false);
  };

  useAnimation(animation, cleanup, () => {}, visible);

  return (
    <>
      <Inputs3D gridPositionX={-1.3} show={showLayout}>
        <MassSlider value={mass} setter={setMass} />
        <SpeedSlider />
      </Inputs3D>
      <mesh visible={showLayout}>
        <LineChart
          show={showLayout}
          disableHover
          width={0.33}
          gridPositionX={0.25}
          opacity={opacity}
          name="Coefficient of Lift"
          traces={[{ name: "Power", points: profileCl }]}
          axes={{
            x: {
              symbol: (
                <HoverableFormulaSimple
                  className="text-lg"
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
          show={showLayout}
          disableHover
          width={0.5}
          gridPositionX={1.1}
          opacity={opacity}
          name="Coefficient of Drag"
          traces={[{ name: "Power", points: profileCd }]}
          axes={{
            x: {
              symbol: (
                <HoverableFormulaSimple
                  className="text-lg"
                  name="Coefficient of Drag"
                  tex="C_D"
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
      </mesh>
    </>
  );
};

export default LevelFlight;
