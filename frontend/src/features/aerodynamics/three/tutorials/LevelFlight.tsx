import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SpringValue, useSpring } from "@react-spring/three";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import { useWingStore } from "../../stores/useWing";
import useProfileCharts from "../../hooks/useProfileCharts";
import { useCameraStore } from "../../../common/three/stores/useCamera";
import Inputs3D from "../../../common/three/Inputs3D";
import MassSlider from "./MassSlider";
import SpeedSlider from "./SpeedSlider";
import LineChart from "../../../common/three/LineChart";
import useProfileTable, { Row } from "../../hooks/useProfileTable";
import HoverableFormulaSimple from "../../../common/HoverableFormulaSimple";
import Formula from "../../../common/Formula";
import useSubs from "../../../common/subtitles/hooks/useSubs";

interface Props {
  opacity: SpringValue<number>;
}

const LevelFlight = ({ opacity }: Props) => {
  const profile = useWingStore((state) => state.profile);
  const { pointsCl, pointsCd, useProfileChartsStore } = useProfileCharts();
  const mass = useHoverProfileStore((state) => state.mass);
  const setMass = useHoverProfileStore((state) => state.setMass);
  const speed = useHoverProfileStore((state) => state.speed);
  const setSpeed = useHoverProfileStore((state) => state.setSpeed);

  const setProfile = useWingStore((state) => state.setProfile);
  const set = useHoverProfileStore((state) => state.set);
  const setChart = useProfileChartsStore((state) => state.set);
  const setCamera = useCameraStore((state) => state.set);
  const chart = useProfileChartsStore();

  const savedProfile = useRef("");
  const savedAngle = useRef(0);
  const savedLock = useRef<string | boolean>("");

  const { maxCz } = useProfileTable(1, profile) as Row;

  useEffect(() => {
    setChart({ yHover: Math.min(maxCz, mass / (speed * speed)) });
    const diff = Math.min(maxCz, mass / (speed * speed)) * speed * speed - mass;
    set({ fallVelocity: -diff });
  }, [mass, speed]);

  const [showLayout, setShowLayout] = useState(false);

  const { pathname, state } = useLocation();

  const { displaySub, hideSubs } = useSubs();

  useSpring(
    () => ({
      from: {
        debug: true,
      },
      to: async (next) => {
        if (pathname === "/aerodynamics/levelFlight") {
          savedProfile.current = profile;
          savedAngle.current = chart.xHover;
          savedLock.current = chart.locked;

          await next({ delay: 2000 });
          setChart({ yHover: 0.5 });
          setChart({ hover: true, locked: "Coefficient of Drag" });
          await displaySub(next, "When we want to maintain level flight", 2000);
          await displaySub(
            next,
            "The forces acting in the vertical direction must be equal",
            1500
          );
          set({ showWeight: true });
          await displaySub(
            next,
            <div className="flex text-4xl">
              <Formula className=" text-error" tex="W" />
              <Formula tex="\: = \:" />
              <Formula className="text-primary" tex="L" />
            </div>,
            3000,
            true
          );
          await displaySub(
            next,
            <div className="flex items-center h-20 text-4xl">
              <Formula tex="mg" className="mt-4" />
              <Formula tex="\: = \:" />
              <Formula tex="\frac{1}{2} \rho V^2 S C_L" />
            </div>,
            3000,
            true
          );
          await displaySub(next, "So our coefficient of lift must be equal to");
          await displaySub(
            next,
            <div className="flex items-center h-20 text-4xl">
              <Formula className=" text-primary" tex="C_L" />
              <Formula tex="\: = \:" />
              <Formula tex="\frac {2mg} {\rho V^2 S }" />
            </div>,
            4000,
            true
          );
          await displaySub(
            next,
            <p className="flex">
              Drag is proportional to <Formula tex="\: V^2" />
            </p>
          );
          setCamera({ center: [0, 0, 0], spherical: [20, 90, 0] });
          setShowLayout(true);
        } else if (state.previousPath === "/aerodynamics/levelFlight") {
          hideSubs();
          set({ showWeight: false, mass: 0.5, speed: 1 });
          setChart({
            hover: false,
            xHover: savedAngle.current,
            locked: savedLock.current,
          });
          setProfile(savedProfile.current ? savedProfile.current : profile);
          setShowLayout(false);
        }
      },
    }),
    [pathname]
  );

  return (
    <>
      <Inputs3D gridPositionX={-1.3} show={showLayout}>
        <MassSlider value={mass} setter={setMass} />
        <SpeedSlider value={speed} setter={setSpeed} />
      </Inputs3D>
      <mesh visible={showLayout}>
        <LineChart
          show={showLayout}
          disableHover
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
          traces={[{ name: "Power", points: pointsCd }]}
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
