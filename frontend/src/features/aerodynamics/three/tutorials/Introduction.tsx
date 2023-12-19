import { useNavigate } from "react-router-dom";
import { DRAG_VECTOR_SCALE } from "../../../common/three/config";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import { useWingStore } from "../../stores/useWing";
import { useProfileChartsStore } from "../../hooks/useProfileCharts";
import useSubs from "../../../common/subtitles/hooks/useSubs";
import IntroductionVectors from "./IntroductionVectors";
import { ElementProps } from "../../../navigation/Route";
import useAnimation from "../../../common/subtitles/hooks/useAnimation";
import { useBernoulliStore } from "./stores/useBernoulli";
import { useNewtonStore } from "./stores/useNewton";
import { useMisconceptionStore } from "./stores/useMisconception";

const Introduction = ({ opacity, visible }: ElementProps) => {
  const setProfile = useWingStore((state) => state.setProfile);
  const setReynolds = useWingStore((state) => state.setReynolds);

  const set = useHoverProfileStore((state) => state.set);
  const setBernoulli = useBernoulliStore((state) => state.set);
  const setNewton = useNewtonStore((state) => state.set);
  const setMisconception = useMisconceptionStore((state) => state.set);

  const setChart = useProfileChartsStore((state) => state.set);

  const navigate = useNavigate();

  const { subtitle, waitForClick: wait, showSub, hideSubs } = useSubs();

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

  const setup = () => {
    setProfile("06");
    setReynolds(6);
    set({
      showChord: true,
      showCamber: false,
    });
  };

  const animation = async () => {
    set({
      centerVectors: true,
      splitVectors: false,
      dragMultiplier: 1,
      vectorSize: 1.5,
    });
    setChart({ xHover: 0.01 });
    await subtitle("How do airplanes fly?");
    await subtitle("Imagine a simple rectangular plate in a strong wind", () =>
      setChart({ hover: true, locked: "Coefficient of Lift", xHover: 0 })
    );
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

    await subtitle("Let's stop the flow for a moment", async () => {
      set({ showVectors: false, keepAngle: true });
      setChart({ hover: false });
    });

    await subtitle(
      "Air molecules are constantly colliding and pushing on the plate",
      async () => set({ pressuresShow: true })
    );

    await subtitle("This is pressure");
    await subtitle("Without the air flow");
    await subtitle(
      "The atmospheric pressure acting on our plate cancels out",
      async () => set({ vectorsNet: true })
    );
    await subtitle("Resulting in a zero net force", async () =>
      set({ pressuresShow: false })
    );

    set({ vectorsNet: false });
    await wait(500);

    await subtitle("When we add back the flow", async () => {
      setChart({ hover: true });
      set({
        pressuresShow: true,
        pressuresEqual: false,
        keepAngle: false,
      });
    });
    await subtitle("The exposed lower side of the plate gets more collisions");
    await subtitle("The pressure goes up");

    await subtitle("The upper surface is shielded from the flow");
    await subtitle("So actually less particles are hitting it");
    await subtitle("The same applies to the shorter sides");

    await subtitle(
      "The net force is the aerodynamic force we saw earlier",
      async () => {
        await wait(500);
        set({ vectorsNet: true });
        await wait(600);
        set({ pressuresShow: false });
        await wait(250);
        set({
          showVectors: true,
        });
      }
    );

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

    await subtitle("so we actually need a moment to counteract it", () =>
      set({ moment: true, centerVectors: false })
    );

    await subtitle("This is the pitching moment");
    await subtitle("We'll skip it for now for simplification", () =>
      set({ moment: false })
    );

    await subtitle("The pressure difference affects the flow around the plate");
    await subtitle("Air is actually moving faster on the top");
    await subtitle(
      "We can explain this change using the Bernoulli's principle",
      () => setBernoulli({ show: true })
    );

    await subtitle("The height difference is negligible");
    await subtitle("so we can hide the second term", () =>
      setBernoulli({ potential: false })
    );

    await subtitle("Now when we decrease the pressure");
    await subtitle("The speed will increase", () =>
      setBernoulli({ speedUp: true })
    );
    setBernoulli({ show: false });
    await wait(500);

    await subtitle("There is another explanation using Newton's Laws");
    await subtitle("The flow changes direction because of the plate", () =>
      setNewton({ show: true })
    );
    await subtitle("According to Newton's 2nd Law", () =>
      setNewton({ force: true })
    );
    await subtitle(
      "this requires a force acting on the flow by the plate",
      () => setNewton({ velocity: false, acceleration: true })
    );
    setNewton({ show: false });
    await subtitle(
      "By Newton's 3rd Law we should have a force acting on the plate"
    );
    await subtitle(
      "We can split it into vertical and horizontal components",
      () => set({ splitVectors: true })
    );

    await subtitle("Even a simple plate can produce lift");
    await subtitle("But the drag is very high");
    await subtitle("There are however better shapes");
    await subtitle("Like this aerodynamic profile", () => setProfile("2412"));
    await subtitle("It produces so much less drag");
    await subtitle("that we have to scale it 10x", () =>
      set({ dragMultiplier: 10 })
    );

    await subtitle("There is a common misconception regarding lift", () =>
      setChart({ hover: false, locked: "" })
    );
    await subtitle(
      "We assume that air particles require equal time",
      async () => {
        setMisconception({ show: true });
        await wait(750);
        setMisconception({ swap: true });
        await wait(1000);
        setMisconception({ constant: true });
      },
      50
    );
    await subtitle("to travel along the upper and lower surfaces");
    await subtitle("This forces the air above to speed up", async () => {
      setMisconception({ bigger: true });
      await wait(1000);
    });
    await subtitle(
      "because it has a longer way to go along the upper side",
      () => set({ flattenOutline: true })
    );
    await subtitle("Speed difference → pressure difference → lift");
    await subtitle("But here is a catch");
    await subtitle("That's physically impossible", () =>
      setMisconception({ error: true })
    );

    await subtitle(
      "A plate would generate no lift because it's symmetrical",
      async () => {
        setMisconception({ show: false });
        set({ flattenOutline: false });
        setProfile("06");
        await wait(1500);
        set({ flattenOutline: true });
      }
    );

    await subtitle("The components of an airfoil:", () => {
      set({ flattenOutline: false, showChord: false });
      setProfile("2412");
    });
    await subtitle(<p className="text-primary">outline</p>);
    await subtitle(<p className="text-base-content">chord line</p>, () =>
      set({ showChord: true })
    );
    await subtitle(<p className="text-secondary">camber line</p>, () =>
      set({ showCamber: true })
    );
    await subtitle(
      <>
        it's a&nbsp;<p className="text-primary">NACA 2412</p>&nbsp;profile
      </>
    );
    await subtitle("It belongs to the NACA 4-digit series family");
    await subtitle("This name is a simple mathematical relation", () =>
      set({ hoverPlane: true })
    );
    set({ hoverA: true });
    await wait(750);
    await showSub("max camber");
    await showDimension(["1412", "2412", "3412", "4412", "5412", "4412"]);
    set({ hoverA: false });
    hideSubs();
    await wait(1000);

    set({ hoverB: true });
    await wait(750);
    await showSub("position of max camber");
    await showDimension(["4312", "4412", "4512", "4612", "4512", "4412"]);
    set({ hoverB: false });
    hideSubs();
    await wait(1000);

    set({ hoverC: true });
    await wait(750);
    await showSub("position of max camber");
    await showDimension(["4415", "4418", "4421", "4424", "4412"]);
    await subtitle("The max thickness is at 30% of chord");
    set({ hoverC: false });
    hideSubs();
    await wait(1000);

    set({ hoverPlane: false, vectorSize: 1 });
    await wait(500);

    navigate("/aerodynamics/profile");
  };

  const cleanup = () => {
    setBernoulli({ show: false, potential: true, speedUp: false });
    setNewton({
      show: false,
      velocity: true,
      force: false,
      acceleration: false,
    });
    setMisconception({
      show: false,
      swap: false,
      constant: false,
      bigger: false,
      error: false,
    });
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
      flattenOutline: false,
    });
  };

  useAnimation(animation, cleanup, setup, visible);

  return <IntroductionVectors opacity={opacity} />;
};

export default Introduction;
