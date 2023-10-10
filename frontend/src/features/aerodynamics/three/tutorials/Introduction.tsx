import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SpringValue, useSpring } from "@react-spring/three";
import { DRAG_VECTOR_SCALE } from "../../../common/three/config";
import AnimatedHtml from "../../../common/three/AnimatedHtml";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import { useWingStore } from "../../stores/useWing";
import { useProfileChartsStore } from "../../hooks/useProfileCharts";

interface Props {
  opacity: SpringValue<number>;
}

const Introduction = ({ opacity }: Props) => {
  const profile = useWingStore((state) => state.profile);
  const setProfile = useWingStore((state) => state.setProfile);
  const set = useHoverProfileStore((state) => state.set);
  const setChart = useProfileChartsStore((state) => state.set);
  const chart = useProfileChartsStore();

  const savedProfile = useRef("");
  const savedAngle = useRef(0);
  const savedLock = useRef<string | boolean>("");

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
        if (pathname === "/aerodynamics/introduction") {
          savedProfile.current = profile;
          savedAngle.current = chart.xHover;
          savedLock.current = chart.locked;
          setProfile("09");
          set({
            showChord: true,
            showCamber: false,
          });

          await next({ delay: 2000 });
          set({
            splitVectors: false,
            dragMultiplier: 1,
            vectorSize: 1.5,
          });
          setChart({ xHover: 0 });
          await displaySub(
            next,
            "Let's start with a simple rectangular plate.",
            2000
          );
          setChart({ hover: true, locked: "Coefficient of Lift" });
          await displaySub(next, "When it is not angled", 1500);
          await displaySub(
            next,
            "the force acting on the plate is only horizontal."
          );
          await setAngles(next, [0.1, 0.5, 1, 2, 3, 4, 5]);
          await displaySub(next, "In order to deflect the air downwards");
          await displaySub(next, "the plate must exert a force on the flow");
          await displaySub(
            next,
            "By Newton's 3rd Law we should have a force acting on the plate.",
            4000
          );
          set({ splitVectors: true });
          await displaySub(
            next,
            "We can split it into vertical and horizontal components."
          );
          await displaySub(next, "Even a simple plate can produce lift.");
          await displaySub(next, "There are however better shapes");
          setProfile("2412");
          await displaySub(next, "Like this aerodynamic profile");
          await displaySub(next, "It produces so much less drag");
          set({ dragMultiplier: 10 });
          await displaySub(next, "that we have to scale it 10x");
          setChart({ hover: false, locked: "" });
          set({ showChord: false });
          await displaySub(
            next,
            <>
              This profile has an&nbsp;<p className="text-primary">outline</p>
            </>
          );
          set({ showChord: true });
          await displaySub(
            next,
            <p style={{ color: "hsl(var(--bc))" }}>chord line</p>
          );
          set({ showCamber: true });
          await displaySub(next, <p className="text-secondary">camber line</p>);
          await displaySub(
            next,
            <>
              it's a&nbsp;<p className="text-primary">NACA 2412</p>&nbsp;profile
            </>
          );

          set({ hoverPlane: true });
          set({ hoverA: true });
          await next({ delay: 750 });
          showSub("max camber");
          await showDimension(next, "hoverA", [
            "1412",
            "2412",
            "3412",
            "4412",
            "5412",
            "6412",
            "4412",
          ]);
          set({ hoverA: false });
          hideSub();
          await next({ delay: 1000 });

          set({ hoverB: true });
          await next({ delay: 750 });
          showSub("position of max camber");
          await showDimension(next, "hoverB", [
            "4312",
            "4412",
            "4512",
            "4612",
            "4512",
            "4412",
          ]);
          set({ hoverB: false });
          hideSub();
          await next({ delay: 1000 });

          set({ hoverC: true });
          await next({ delay: 750 });
          showSub("max thickness");
          await showDimension(next, "hoverC", [
            "4415",
            "4418",
            "4421",
            "4424",
            "4415",
          ]);
          set({ hoverC: false });
          hideSub();

          set({ hoverPlane: false, vectorSize: 1 });
          await next({ delay: 500 });
          setProfile(savedProfile.current);
          setChart({ xHover: savedAngle.current, locked: savedLock.current });

          navigate("/aerodynamics/profile", {
            state: { previousPath: pathname },
          });
        } else if (state.previousPath === "/aerodynamics/introduction") {
          set({
            hoverA: false,
            hoverB: false,
            hoverC: false,
            hoverPlane: false,
            dragMultiplier: DRAG_VECTOR_SCALE,
            splitVectors: true,
            vectorSize: 1,
            showChord: true,
            showCamber: true,
          });
          setChart({
            hover: false,
            xHover: savedAngle.current,
            locked: savedLock.current,
          });
          setProfile(savedProfile.current ? savedProfile.current : profile);
        }
      },
    }),
    [pathname]
  );

  return (
    <mesh position={[-4.5, -3, 0]}>
      <AnimatedHtml show={showSubtitle}>
        <div className="flex justify-center">{subtitle}</div>
      </AnimatedHtml>
    </mesh>
  );
};

export default Introduction;
