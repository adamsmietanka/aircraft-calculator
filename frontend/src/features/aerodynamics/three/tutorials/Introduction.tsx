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
    await next({ delay: 750 });
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
          await displaySub(next, "How do airplanes fly?", 2000);
          setChart({ hover: true, locked: "Coefficient of Lift", xHover: 0 });
          await displaySub(
            next,
            "Imagine a simple rectangular plate in a strong wind"
          );
          await displaySub(next, "There's a force acting on it");
          await displaySub(
            next,
            "When it's parallel to the airflow that force is minimal"
          );

          await showSub("When angled it quickly grows");
          await setAngles(
            next,
            Array.from(Array(16).keys()).map((i) => (i / 15) * (i / 15) * 5)
          );
          hideSubs();
          await next({ delay: 500 });

          await displaySub(next, "What is the source of this force?");
          set({ showVectors: false, keepAngle: true });
          await next({ delay: 500 });

          setChart({ hover: false });
          await displaySub(next, "Let's stop the flow for a moment");

          await displaySub(
            next,
            "Air molecules are constantly colliding and pushing on the plate"
          );

          set({ pressuresShow: true });

          await displaySub(next, "This is pressure", 1500);
          await displaySub(next, "Without the air flow", 1500);
          await displaySub(
            next,
            "The atmospheric pressure acting on our plate cancels out"
          );
          set({ vectorsNet: true });
          await displaySub(next, "Resulting in a zero net force");

          set({ vectorsNet: false });
          await next({ delay: 500 });

          setChart({ hover: true });
          set({ pressuresEqual: false, keepAngle: false });

          await displaySub(next, "When we add back the flow");
          await displaySub(
            next,
            "The exposed lower side of the plate gets more collisions"
          );
          await displaySub(next, "The pressure goes up");

          await displaySub(next, "The upper surface is shielded from the flow");
          await displaySub(next, "So actually less particles are hitting it");
          await displaySub(next, "The same applies to the shorter sides");
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
          await next({ delay: 300 });

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
          hideSubs();
          setChart({ xHover: 5 });
          await next({ delay: 250 });

          await displaySub(
            next,
            "so we actually need a moment to counteract it"
          );
          set({ moment: true, centerVectors: false });
          await next({ delay: 500 });

          await displaySub(next, "This is the pitching moment");
          set({ moment: false });
          await displaySub(next, "We'll skip it for now for simplification");

          await displaySub(
            next,
            "The pressure difference affects the flow around the plate",
            3500
          );
          await displaySub(next, "Air is actually moving faster on the top");
          await displaySub(
            next,
            "We can explain this change using the Bernoulli's principle"
          );
          set({ showBernoulli: true });
          await next({ delay: 500 });

          await displaySub(next, "The height difference is negligible");
          set({ showBernoulliPotential: false });
          await displaySub(next, "so we can hide the second term");

          await displaySub(next, "Now when we decrease the pressure");
          set({ showBernoulliDiff: true });

          await displaySub(next, "The speed will increase");
          set({ showBernoulli: false });

          await displaySub(
            next,
            "There is another explanation using Newton's Laws"
          );

          set({ showNewton: true, showNewtonVelocity: true });
          await displaySub(
            next,
            "The flow changes direction because of the plate"
          );

          set({ showNewtonForce: true });
          await displaySub(next, "According to Newton's 2nd Law", 2000);
          await displaySub(
            next,
            "this requires a force acting on the flow by the plate",
            4000
          );

          set({ showNewtonVelocity: false });
          await next({ delay: 600 });
          set({ showNewtonAccel: true });
          await displaySub(
            next,
            "By Newton's 3rd Law we should have a force acting on the plate",
            4000
          );
          set({ showNewton: false });

          set({ splitVectors: true });
          await displaySub(
            next,
            "We can split it into vertical and horizontal components"
          );

          await displaySub(next, "Even a simple plate can produce lift");
          await displaySub(next, "There are however better shapes");

          setProfile("2412");
          await displaySub(next, "Like this aerodynamic profile");
          await displaySub(next, "It produces so much less drag");

          set({ dragMultiplier: 10 });
          await displaySub(next, "that we have to scale it 10x");

          setChart({ hover: false, locked: "" });

          // MISCONCEPTION
          await displaySub(
            next,
            "There is a common misconception regarding lift"
          );

          await showSub("We assume that air particles require equal time");
          set({ misconception: true });
          await next({ delay: 2500 });
          set({ misconceptionSwap: true });
          await next({ delay: 500 });
          hideSubs();

          await displaySub(
            next,
            "to travel along the upper and lower surfaces"
          );

          set({ misconceptionConst: true });
          await next({ delay: 500 });

          await displaySub(next, "This forces the air above to speed up");
          set({ misconceptionBigger: true });
          await next({ delay: 500 });
          set({ flattenOutline: true });

          await displaySub(
            next,
            "because it has a longer way to go along the upper side"
          );

          await displaySub(
            next,
            "Speed difference → pressure difference → lift"
          );

          await displaySub(next, "But here is a catch");
          set({ misconceptionError: true });
          await next({ delay: 1000 });

          await displaySub(next, "That's physically impossible");

          set({ misconception: false, flattenOutline: false });
          await next({ delay: 1000 });
          setProfile("06");
          await next({ delay: 500 });
          set({ flattenOutline: true });
          await displaySub(
            next,
            "A plate would generate no lift because it's symmetrical"
          );
          set({ flattenOutline: false });

          setProfile("2412");
          set({
            misconceptionSwap: false,
            misconceptionConst: false,
            misconceptionBigger: false,
            misconceptionError: false,
          });

          set({ showChord: false });
          await displaySub(next, "The components of an airfoil:");

          await displaySub(next, <p className="text-primary">outline</p>);

          await showSub(<p className="text-base-content">chord line</p>);
          set({ showChord: true });
          await next({ delay: 2000 });
          hideSubs();
          await next({ delay: 500 });

          await showSub(<p className="text-secondary">camber line</p>);
          set({ showCamber: true });
          await next({ delay: 2000 });
          hideSubs();
          await next({ delay: 500 });

          await displaySub(
            next,
            <>
              it's a&nbsp;<p className="text-primary">NACA 2412</p>&nbsp;profile
            </>
          );
          await displaySub(
            next,
            "It belongs to the NACA 4-digit series family"
          );
          await displaySub(next, "This name is a simple mathematical relation");

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
          await showDimension(next, ["4415", "4418", "4421", "4424", "4412"]);
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
            showNewton: false,
            showNewtonVelocity: false,
            showNewtonForce: false,
            showNewtonAccel: false,
            misconception: false,
            misconceptionSwap: false,
            misconceptionConst: false,
            misconceptionBigger: false,
            misconceptionError: false,
            flattenOutline: false,
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
