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
  const setReynolds = useWingStore((state) => state.setReynolds);

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

  const setAngles = async (next: any, angles: number[], delay = 100) => {
    for (const a of angles) {
      setChart({ xHover: a });
      await next({ delay });
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
          setProfile("06");
          setReynolds(6);
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
          await displaySub(next, "When it's parallel to the airflow", 1500);
          await displaySub(next, "the force acting on the plate is minimal");

          await showSub("When angled it quickly grows");
          await setAngles(
            next,
            Array.from(Array(16).keys()).map((i) => (i / 15) * (i / 15) * 5)
          );
          hideSubs();

          await displaySub(next, "What is the source of this force?");
          set({ showVectors: false, keepAngle: true });
          await next({ delay: 500 });

          await showSub("Let's stop the flow for a moment");
          setChart({ hover: false });
          await next({ delay: 1500 });
          hideSubs();

          await displaySub(
            next,
            "Air molecules are constantly colliding with the plate"
          );

          set({ pressuresShow: true });
          await displaySub(next, "Without the air flow");
          await displaySub(
            next,
            "The atmospheric pressure acting on our plate cancels out"
          );
          set({ vectorsNet: true });
          await displaySub(next, "Resulting in a zero net force");
          set({ pressuresShow: false });
          await next({ delay: 500 });

          set({ vectorsNet: false });
          await next({ delay: 500 });
          set({ pressuresShow: true });

          setChart({ hover: true });
          set({ pressuresEqual: false, keepAngle: false });

          await displaySub(next, "When we add back the flow");
          await displaySub(
            next,
            "The exposed lower side of the plate gets more collisions"
          );
          await displaySub(next, "The pressure goes up");
          await next({ delay: 500 });

          await displaySub(next, "The upper surface is shielded from the flow");
          await displaySub(next, "So actually less particles are hitting it");
          await next({ delay: 500 });

          set({ vectorsNet: true });
          await next({ delay: 500 });

          await displaySub(
            next,
            "The net force is the aerodynamic force we saw earlier"
          );

          set({ pressuresShow: false });
          await next({ delay: 200 });
          set({
            showVectors: true,
          });
          await next({ delay: 500 });

          await displaySub(
            next,
            "Usually the wing rotation axis is not positioned at the center"
          );
          await displaySub(next, "but at 25% of length");

          await showSub("However this will create a torque and spin our plate");
          await next({ delay: 500 });
          await setAngles(
            next,
            Array.from(Array(16).keys()).map((i) => (-i + 15) / 3)
          );
          await next({ delay: 500 });
          hideSubs();
          setChart({ xHover: 5 });
          await next({ delay: 500 });

          await displaySub(
            next,
            "so we actually need a moment to counteract it"
          );
          set({ moment: true });
          await next({ delay: 500 });
          set({ centerVectors: false });
          await next({ delay: 500 });

          await displaySub(
            next,
            "Nearly every profile has some pitching moment"
          );
          set({ moment: false });
          await displaySub(next, "But we'll skip it for a moment");

          await displaySub(
            next,
            "The pressure difference affects the flow around the plate",
            3500
          );
          await displaySub(next, "We can explain the change in velocity");
          await displaySub(next, "using the Bernoulli's principle");
          set({ showBernoulli: true });
          await next({ delay: 500 });

          await displaySub(next, "The height difference is negligible");
          set({ showBernoulliPotential: false });
          await displaySub(next, "so we can hide the second term");

          await displaySub(next, "Now when we decrease the pressure");
          set({ showBernoulliDiff: true });
          await next({ delay: 500 });

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
          await displaySub(next, <p className="text-primary">outline</p>);
          set({ showChord: true });
          await displaySub(
            next,
            <p className="text-base-content">chord line</p>
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
          await showSub("max camber");
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
          await showSub("position of max camber");
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
          await showSub("max thickness");
          await showDimension(next, ["4415", "4418", "4421", "4424", "4415"]);
          hideSubs();
          await next({ delay: 500 });
          await displaySub(next, "The max thickness is at 30% of chord");
          set({ hoverC: false });

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
            centerVectors: false,
            vectorsNet: false,
            keepAngle: false,
            moment: false,
            dragMultiplier: DRAG_VECTOR_SCALE,
            splitVectors: true,
            showVectors: true,
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
