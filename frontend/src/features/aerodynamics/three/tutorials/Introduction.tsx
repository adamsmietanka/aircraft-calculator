import { useNavigate } from "react-router-dom";
import { DRAG_VECTOR_SCALE } from "../../../common/three/config";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import { useWingStore } from "../../stores/useWing";
import { useProfileChartsStore } from "../../hooks/useProfileCharts";
import useSubs from "../../../common/subtitles/hooks/useSubs";
import IntroductionVectors from "./IntroductionVectors";
import { ElementProps } from "../../../navigation/Route";
import useAnimation from "../../../common/subtitles/hooks/useAnimation";

const Introduction = ({ opacity, visible }: ElementProps) => {
  const setProfile = useWingStore((state) => state.setProfile);
  const setReynolds = useWingStore((state) => state.setReynolds);

  const set = useHoverProfileStore((state) => state.set);
  const setChart = useProfileChartsStore((state) => state.set);

  const navigate = useNavigate();

  const { subtitle, waitForClick: wait } = useSubs();

  const showDimension = async (profiles: string[]) => {
    for (const p of profiles) {
      await wait(600);
      setProfile(p);
    }
  };

  const setAngles = async (angles: number[], delay = 100) => {
    for (const a of angles) {
      setChart({ xHover: a });
      await wait(delay);
    }
    await wait(250);
  };

  const animation = async () => {
    setProfile("06");
    setReynolds(6);
    set({
      showChord: true,
      showCamber: false,
    });

    await wait(2000);
    set({
      centerVectors: true,
      splitVectors: false,
      dragMultiplier: 1,
      vectorSize: 1.5,
    });
    setChart({ xHover: 0.01 });
    await subtitle("How do airplanes fly?");
    setChart({ hover: true, locked: "Coefficient of Lift", xHover: 0 });
    await subtitle("Imagine a simple rectangular plate in a strong wind");
    await subtitle("There's a force acting on it");
    await subtitle("When it's parallel to the airflow that force is minimal");

    await subtitle(
      "When angled it quickly grows",
      async () =>
        await setAngles(
          Array.from(Array(16).keys()).map((i) => (i / 15) * (i / 15) * 5)
        ),
      50
    );

    await subtitle("What is the source of this force?");
    set({ showVectors: false, keepAngle: true });
    await wait(500);

    await subtitle("Let's stop the flow for a moment", async () =>
      setChart({ hover: false })
    );

    await subtitle(
      "Air molecules are constantly colliding and pushing on the plate"
    );

    set({ pressuresShow: true });

    await subtitle("This is pressure");
    await subtitle("Without the air flow");
    await subtitle("The atmospheric pressure acting on our plate cancels out");
    set({ vectorsNet: true });
    await subtitle("Resulting in a zero net force");

    set({ vectorsNet: false });
    await wait(500);

    await subtitle("When we add back the flow", async () => {
      setChart({ hover: true });
      set({ pressuresEqual: false, keepAngle: false });
    });
    await subtitle("The exposed lower side of the plate gets more collisions");
    await subtitle("The pressure goes up");

    await subtitle("The upper surface is shielded from the flow");
    await subtitle("So actually less particles are hitting it");
    await subtitle("The same applies to the shorter sides");
    await wait(500);

    set({ vectorsNet: true });
    await wait(500);

    await subtitle("The net force is the aerodynamic force we saw earlier");

    set({ pressuresShow: false });
    await wait(200);
    set({
      showVectors: true,
    });
    await wait(300);

    await subtitle(
      "Usually the wing rotation axis is not positioned at the center"
    );
    await subtitle("but at 25% of length");

    await subtitle(
      "However this will create a torque and spin our plate",
      async () => {
        await wait(500);
        await setAngles(Array.from(Array(16).keys()).map((i) => (-i + 15) / 3));
        setChart({ xHover: 5 });
      },
      50
    );

    await subtitle("so we actually need a moment to counteract it");
    set({ moment: true, centerVectors: false });
    await wait(500);

    await subtitle("This is the pitching moment");
    set({ moment: false });
    await subtitle("We'll skip it for now for simplification");

    await subtitle("The pressure difference affects the flow around the plate");
    await subtitle("Air is actually moving faster on the top");
    await subtitle(
      "We can explain this change using the Bernoulli's principle"
    );
    set({ showBernoulli: true });
    await wait(500);

    await subtitle("The height difference is negligible");
    set({ showBernoulliPotential: false });
    await subtitle("so we can hide the second term");

    await subtitle("Now when we decrease the pressure");
    set({ showBernoulliDiff: true });

    await subtitle("The speed will increase");
    set({ showBernoulli: false });

    await subtitle("There is another explanation using Newton's Laws");

    set({ showNewton: true, showNewtonVelocity: true });
    await subtitle("The flow changes direction because of the plate");

    set({ showNewtonForce: true });
    await subtitle("According to Newton's 2nd Law");
    await subtitle("this requires a force acting on the flow by the plate");

    set({ showNewtonVelocity: false });
    await wait(600);
    set({ showNewtonAccel: true });
    await subtitle(
      "By Newton's 3rd Law we should have a force acting on the plate"
    );
    set({ showNewton: false });

    set({ splitVectors: true });
    await subtitle("We can split it into vertical and horizontal components");

    await subtitle("Even a simple plate can produce lift");
    await subtitle("There are however better shapes");

    setProfile("2412");
    await subtitle("Like this aerodynamic profile");
    await subtitle("It produces so much less drag");

    set({ dragMultiplier: 10 });
    await subtitle("that we have to scale it 10x");

    setChart({ hover: false, locked: "" });

    // MISCONCEPTION
    await subtitle("There is a common misconception regarding lift");

    await subtitle(
      "We assume that air particles require equal time",
      async () => {
        set({ misconception: true });
        await wait(2500);
        set({ misconceptionSwap: true });
        await wait(500);
      },
      50
    );

    await subtitle("to travel along the upper and lower surfaces");

    set({ misconceptionConst: true });
    await wait(500);

    await subtitle("This forces the air above to speed up");
    set({ misconceptionBigger: true });
    await wait(500);
    set({ flattenOutline: true });

    await subtitle("because it has a longer way to go along the upper side");

    await subtitle("Speed difference → pressure difference → lift");

    await subtitle("But here is a catch");
    set({ misconceptionError: true });
    await wait(1000);

    await subtitle("That's physically impossible");

    set({ misconception: false, flattenOutline: false });
    await wait(1000);
    setProfile("06");
    await wait(500);
    set({ flattenOutline: true });
    await subtitle("A plate would generate no lift because it's symmetrical");
    set({ flattenOutline: false });

    setProfile("2412");
    set({
      misconceptionSwap: false,
      misconceptionConst: false,
      misconceptionBigger: false,
      misconceptionError: false,
    });

    set({ showChord: false });
    await subtitle("The components of an airfoil:");

    await subtitle(<p className="text-primary">outline</p>);

    await subtitle(<p className="text-base-content">chord line</p>, async () =>
      set({ showChord: true })
    );

    await subtitle(<p className="text-secondary">camber line</p>, async () =>
      set({ showCamber: true })
    );

    await subtitle(
      <>
        it's a&nbsp;<p className="text-primary">NACA 2412</p>&nbsp;profile
      </>
    );
    await subtitle("It belongs to the NACA 4-digit series family");
    await subtitle("This name is a simple mathematical relation");

    set({ hoverPlane: true });
    await subtitle(
      "max camber",
      async () => {
        set({ hoverA: true });
        await wait(750);
        await showDimension(["1412", "2412", "3412", "4412", "5412", "4412"]);
        set({ hoverA: false });
      },
      50
    );

    await subtitle(
      "position of max camber",
      async () => {
        set({ hoverB: true });
        await wait(750);
        await showDimension(["4312", "4412", "4512", "4612", "4512", "4412"]);
        set({ hoverB: false });
      },
      50
    );

    await subtitle(
      "max thickness",
      async () => {
        set({ hoverC: true });
        await wait(750);
        await showDimension(["4415", "4418", "4421", "4424", "4412"]);
        set({ hoverC: false });
      },
      50
    );

    await subtitle("The max thickness is at 30% of chord");
    set({ hoverC: false });

    set({ hoverPlane: false, vectorSize: 1 });
    await wait(500);

    navigate("/aerodynamics/profile");
  };

  const cleanup = () => {
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
  };

  useAnimation(animation, cleanup, visible);

  return <IntroductionVectors opacity={opacity} />;
};

export default Introduction;
