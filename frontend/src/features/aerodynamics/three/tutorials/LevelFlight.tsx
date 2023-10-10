import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SpringValue, useSpring } from "@react-spring/three";
import { DRAG_VECTOR_SCALE } from "../../../common/three/config";
import AnimatedHtml from "../../../common/three/AnimatedHtml";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import { useWingStore } from "../../stores/useWing";
import { useProfileChartsStore } from "../../hooks/useProfileCharts";
import Formula from "../../../common/Formula";
import { useCameraStore } from "../../../common/three/stores/useCamera";
import Inputs3D from "../../../common/three/Inputs3D";
import MassSlider from "./MassSlider";

interface Props {
  opacity: SpringValue<number>;
}

const LevelFlight = ({ opacity }: Props) => {
  const profile = useWingStore((state) => state.profile);
  const setProfile = useWingStore((state) => state.setProfile);
  const set = useHoverProfileStore((state) => state.set);
  const setChart = useProfileChartsStore((state) => state.set);
  const setCamera = useCameraStore((state) => state.set);
  const chart = useProfileChartsStore();

  const savedProfile = useRef("");
  const savedAngle = useRef(0);
  const savedLock = useRef<string | boolean>("");

  const [mass, setMass] = useState(1);
  const [showLayout, setShowLayout] = useState(false);

  const { pathname, state } = useLocation();
  const navigate = useNavigate();

  const showDimension = async (next: any, name: string, profiles: string[]) => {
    for (const p of profiles) {
      await next({ delay: 750 });
      setProfile(p);
    }
  };

  const setAngles = async (next: any, angles: number[]) => {
    for (const a of angles) {
      setChart({ xHover: a });
      await next({ delay: 100 });
    }
    await next({ delay: 1000 });
  };

  const [subtitle, setSubtitle] = useState<string | React.ReactNode>("");
  const [showSubtitle, setShowSubtitle] = useState(false);

  const displaySub = async (
    next: any,
    text: string | React.ReactNode,
    duration = 3000
  ) => {
    setSubtitle(text);
    setShowSubtitle(true);
    await next({ delay: duration });
    setShowSubtitle(false);
    await next({ delay: 1500 });
  };

  const showSub = (text: string | React.ReactNode) => {
    setSubtitle(text);
    setShowSubtitle(true);
  };

  const hideSub = () => setShowSubtitle(false);

  const [introductionSpring, introductionSpringApi] = useSpring(
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
          setChart({ xHover: 5 });
          setChart({ hover: true, locked: "Coefficient of Lift" });
          await displaySub(next, "When we want to maintain level flight", 2000);
          await displaySub(
            next,
            "The forces acting in the vertical direction must be equal",
            1500
          );
          set({ showWeight: true });
          await displaySub(
            next,
            <div className="flex">
              <Formula className={`text-xl text-error`} tex={`W`} />
              <Formula className={`text-xl`} tex={`=`} />
              <Formula className={`text-xl text-primary`} tex={`F_L`} />
            </div>
          );
          await displaySub(
            next,
            <div className="flex items-center h-20">
              <Formula className={`text-xl`} tex={`mg`} />
              <Formula className={`text-xl`} tex={`=`} />
              <Formula
                className={`text-xl`}
                tex={`\\frac{1}{2} \\rho V^2 S C_L`}
              />
            </div>
          );
          await displaySub(next, "So our coefficient of lift must be equal to");
          await displaySub(
            next,
            <div className="flex items-center h-20">
              <Formula className={`text-xl text-primary`} tex={`C_L`} />
              <Formula className={`text-xl`} tex={`=`} />
              <Formula
                className={`text-xl`}
                tex={`\\frac{2mg}{\\rho V^2 S }`}
              />
            </div>,
            4000
          );
          setCamera({ center: [0, 0, 0], spherical: [20, 90, 0] });
          setShowLayout(true);
        } else if (state.previousPath === "/aerodynamics/levelFlight") {
          set({ showWeight: false });
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
      <mesh position={[-4.5, -3, 0]}>
        <AnimatedHtml show={showSubtitle}>
          <div className="flex justify-center">{subtitle}</div>
        </AnimatedHtml>
        {/* <AnimatedHtml show={showSubtitle}>
        <div className="flex">
          <Formula className={`text-xl text-error`} tex={`W`} />
          <Formula className={`text-xl`} tex={`=`} />
          <Formula className={`text-xl text-primary`} tex={`F_L`} />
        </div>
      </AnimatedHtml> */}
      </mesh>
      <Inputs3D gridPositionX={-1.3} show={showLayout}>
        <MassSlider
          label="Mass"
          value={mass}
          min={0.5}
          step={0.1}
          max={1.5}
          setter={setMass}
        />
      </Inputs3D>
    </>
  );
};

export default LevelFlight;
