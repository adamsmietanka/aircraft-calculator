import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SpringValue, useSpring } from "@react-spring/three";
import { DRAG_VECTOR_SCALE } from "../../../common/three/config";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import { useWingStore } from "../../stores/useWing";
import { useProfileChartsStore } from "../../hooks/useProfileCharts";
import useSubs from "../../../common/subtitles/hooks/useSubs";
import IntroductionVectors from "./IntroductionVectors";

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

  const showDimension = async (next: any, profiles: string[]) => {
    for (const p of profiles) {
      await next({ delay: 600 });
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

  const { displaySub, hideSubs, showSub } = useSubs();

  useSpring(
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
            centerVectors: true,
            splitVectors: false,
            dragMultiplier: 1,
            vectorSize: 1.5,
          });
          setChart({ xHover: 0.01 });
          await displaySub(
            next,
            "Let's start with a simple rectangular plate",
            2000
          );
          setChart({ hover: true, locked: "Coefficient of Lift", xHover: 0 });
          await displaySub(next, "When it is not angled", 1500);
          await displaySub(
            next,
            "the force acting on the plate is only horizontal"
          );

          await setAngles(next, [0.1, 0.5, 1, 2, 3, 4, 5]);
          await displaySub(next, "When angled it quickly grows");
          await displaySub(next, "What is the source of this force?");
          set({ showVectors: false });
          await next({ delay: 1000 });

          await displaySub(
            next,
            "The lower side of the plate is facing the flow"
          );
          await displaySub(
            next,
            "This means more air molecules smash into it and the pressure goes up"
          );
          set({ vectorBottom: true });
          await next({ delay: 1000 });

          await displaySub(next, "The upper surface is shielded from the flow");
          await displaySub(next, "So actually less particles are hitting it");
          set({ vectorTop: true });
          await next({ delay: 1000 });

          await displaySub(
            next,
            "In fact the pressure is acting on every side of our plate"
          );
          set({ vectorsSide: true });
          await next({ delay: 1000 });

          await displaySub(next, "When we add them up");
          set({ vectorsNet: true });
          await next({ delay: 1000 });

          await displaySub(next, "We get our net force");
          set({
            vectorBottom: false,
            vectorTop: false,
            vectorsSide: false,
          });
          await next({ delay: 200 });
          set({
            showVectors: true,
          });
          await next({ delay: 1000 });

          await displaySub(
            next,
            "Usually the aerodynamic force is not positioned in the center"
          );
          set({ centerVectors: false });
          await next({ delay: 1000 });
          await displaySub(next, "but at 25% of length");

          showSub("However this will create a torque and spin our plate");
          await next({ delay: 500 });
          await setAngles(next, [5.25, 5.5, 6, 6.5, 7, 8, 5]);
          hideSubs();
          await next({ delay: 500 });

          await displaySub(
            next,
            "so we actually need a moment to counteract it"
          );
          set({ moment: true });
          await next({ delay: 1000 });

          await displaySub(
            next,
            "Nearly every profile has some pitching moment"
          );
          await displaySub(next, "But we'll skip it for a moment");
          set({ moment: false });
          await next({ delay: 1000 });

          await displaySub(
            next,
            "The pressure difference affects the flow around the plate",
            3500
          );
          await displaySub(next, "We can explain the change in velocity");
          await displaySub(next, "using the Bernoulli's principle");
          set({ showBernoulli: true });
          await next({ delay: 2000 });

          await displaySub(next, "The height difference is negligible");
          await displaySub(next, "so we can hide the second term");
          set({ showBernoulliPotential: false });
          await next({ delay: 2000 });

          await displaySub(next, "Now when we decrease the pressure");
          set({ showBernoulliDiff: true });
          await next({ delay: 2000 });

          await displaySub(next, "The speed will increase");
          set({ showBernoulli: false });

          await displaySub(
            next,
            "There is another explanation using Newton's 3rd Law"
          );
          await displaySub(next, "In order to deflect the air downwards");
          await displaySub(next, "the plate must exert a force on the flow");
          await displaySub(
            next,
            "so we should have a force acting on the plate.",
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
          await displaySub(next, "The components of an airfoil:");
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
          await showDimension(next, [
            "1412",
            "2412",
            "3412",
            "4412",
            "5412",
            "6412",
            "4412",
          ]);
          set({ hoverA: false });
          hideSubs();
          await next({ delay: 1000 });

          set({ hoverB: true });
          await next({ delay: 750 });
          showSub("position of max camber");
          await showDimension(next, [
            "4312",
            "4412",
            "4512",
            "4612",
            "4512",
            "4412",
          ]);
          set({ hoverB: false });
          hideSubs();
          await next({ delay: 1000 });

          set({ hoverC: true });
          await next({ delay: 750 });
          showSub("max thickness");
          await showDimension(next, ["4415", "4418", "4421", "4424", "4415"]);
          set({ hoverC: false });
          hideSubs();

          set({ hoverPlane: false, vectorSize: 1 });
          await next({ delay: 500 });
          setProfile(savedProfile.current);
          setChart({ xHover: savedAngle.current, locked: savedLock.current });

          navigate("/aerodynamics/profile", {
            state: { previousPath: pathname },
          });
        } else if (state.previousPath === "/aerodynamics/introduction") {
          hideSubs();
          set({
            hoverA: false,
            hoverB: false,
            hoverC: false,
            hoverPlane: false,
            vectorBottom: false,
            vectorTop: false,
            vectorsSide: false,
            vectorsNet: false,
            moment: false,
            dragMultiplier: DRAG_VECTOR_SCALE,
            splitVectors: true,
            vectorSize: 1,
            showChord: true,
            showCamber: true,
            showBernoulli: false,
            showBernoulliPotential: true,
            showBernoulliDiff: false,
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

  return <IntroductionVectors opacity={opacity} />;
};

export default Introduction;
