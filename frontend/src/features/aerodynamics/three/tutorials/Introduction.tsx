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
import { useCameraStore } from "../../../common/three/stores/useCamera";
import IntroductionParticles from "./IntroductionParticles";
import { useAnimationStore } from "../../../common/subtitles/stores/useAnimation";

const Introduction = ({ opacity, visible }: ElementProps) => {
  const setProfile = useWingStore((state) => state.setProfile);
  const setReynolds = useWingStore((state) => state.setReynolds);

  const set = useHoverProfileStore((state) => state.set);
  const setBernoulli = useBernoulliStore((state) => state.set);
  const setNewton = useNewtonStore((state) => state.set);
  const setMisconception = useMisconceptionStore((state) => state.set);

  const setChart = useProfileChartsStore((state) => state.set);
  const setCamera = useCameraStore((state) => state.set);

  const setAnimation = useAnimationStore((state) => state.set);

  const navigate = useNavigate();

  const { sub, pause, show, hide } = useSubs();

  const showDimension = async (profiles: string[]) => {
    for (const p of profiles) {
      await pause(600);
      setProfile(p);
    }
  };

  const setup = () => {
    setProfile("04");
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
    await sub("How do airplanes fly?");
    await sub("Imagine a simple rectangular plate in a strong wind", () =>
      setChart({ hover: true, locked: "Coefficient of Lift", xHover: 0 })
    );
    await sub("There's a force acting on it");
    setAnimation({ slowdown: true });
    await sub("When it's parallel to the airflow that force is minimal");
    await sub("When angled it quickly grows", () => setChart({ xHover: 5 }));
    setAnimation({ slowdown: false });
    await sub("What is the source of this force?");

    await sub("Let's stop the flow for a moment", async () => {
      set({ showVectors: false, keepAngle: true });
      setChart({ hover: false });
    });

    await sub(
      "Air molecules are constantly colliding and pushing on the plate",
      async () => set({ airVectors: true })
    );

    await sub("When we sum up all this forces", async () => {
      set({ airVectorsCenter: true });
      await pause(800);
      set({ airVectors: false });
      await pause(100);
      set({ pressuresShow: true });
    });
    await sub("We get the pressure");
    set({ airVectorsCenter: false });
    await sub("Without the air flow");
    await sub(
      "The atmospheric forces acting on our plate cancel out",
      async () => set({ vectorsNet: true, airVectors: false })
    );
    await sub("Resulting in a zero net force", async () =>
      set({ pressuresShow: false })
    );

    set({ vectorsNet: false });
    await pause(500);

    await sub("When we add back the flow", async () => {
      setChart({ hover: true });
      set({
        pressuresEqual: false,
        keepAngle: false,
      });
    });
    await sub("The exposed lower side of the plate gets more collisions", () =>
      set({ airVectorsLower: true })
    );
    await sub("The pressure goes up", async () => {
      set({ airVectorsCenter: true });
      await pause(800);
      set({ airVectorsLower: false });
      await pause(100);
      set({ pressureLower: true });
    });
    set({ airVectorsCenter: false });
    await pause(250);

    await sub("The upper surface is shielded from the flow", () =>
      set({ airVectorsUpper: true })
    );
    await sub("Fewer collisions result in a lower pressure", async () => {
      set({ airVectorsCenter: true });
      await pause(800);
      set({ airVectorsUpper: false });
      await pause(100);
      set({ pressureUpper: true });
    });
    set({ airVectorsCenter: false });
    await sub("The same applies to the shorter sides", () =>
      set({ pressuresShow: true })
    );

    await sub(
      "The net force is the aerodynamic force we saw earlier",
      async () => {
        await pause(500);
        set({ vectorsNet: true });
        await pause(600);
        set({
          pressuresShow: false,
          pressureLower: false,
          pressureUpper: false,
        });
        await pause(250);
        set({
          showVectors: true,
        });
      }
    );

    await sub(
      "Usually the wing rotation axis is not positioned at the center",
      async () => {
        setCamera({ center: [-4, 0, 0], spherical: [10, 90, 10] });
        await pause(250);
        set({ axis: true });
        await pause(1000);
        setChart({ xHover: 4.5 });
        await pause(250);
        setChart({ xHover: 5.5 });
        await pause(250);
        setChart({ xHover: 5 });
      }
    );
    await sub("but at 25% of length", async () => {
      set({ axisCenter: false });
      setCamera({ spherical: [10, 90, 0] });
    });
    
    setAnimation({ slowdown: true });
    await pause(100);
    setChart({ xHover: 0 });
    await sub("However this will create a torque and spin our plate");
    setAnimation({ slowdown: false });
    await pause(100);
    setChart({ xHover: 5 });

    await sub("so we actually need a moment to counteract it", () =>
      set({ moment: true, centerVectors: false })
    );

    await sub("This is the pitching moment");
    await sub("We'll skip it for now for simplification", () =>
      set({ moment: false, axis: false })
    );

    await sub("The pressure difference affects the flow around the plate");
    await sub("Air is actually moving faster on the top");
    await sub(
      "We can explain this change using the Bernoulli's principle",
      () => setBernoulli({ show: true })
    );

    await sub("The height difference is negligible");
    await sub("so we can hide the second term", () =>
      setBernoulli({ potential: false })
    );

    await sub("Now when we decrease the pressure");
    await sub("The speed will increase", () => setBernoulli({ speedUp: true }));
    setBernoulli({ show: false });
    await pause(500);

    await sub("There is another explanation using Newton's Laws", () =>
      set({ showVectors: false, keepAngle: true })
    );
    await sub("The flow changes direction because of the plate", () => {
      setNewton({ show: true });
      set({ vectorSize: -1.5, vector3rdNewton: true });
    });
    await sub("According to Newton's 2nd Law", () =>
      setNewton({ force: true })
    );
    await sub("this requires a force acting on the flow by the plate", () => {
      setNewton({ velocity: false, acceleration: true });
      set({ showVectors: true, keepAngle: false });
    });
    setNewton({ show: false });
    await sub(
      "By Newton's 3rd Law we should have a force acting on the plate",
      () => {
        set({ vectorSize: 1.5, vector3rdNewton: false });
      }
    );
    await sub("We can split it into two components", () =>
      set({ splitVectors: true })
    );
    await sub(
      <>
        The vertical -<span className="text-primary mx-1">lift</span>
      </>
    );
    await sub(
      <>
        And the horizontal -<span className="text-error mx-1">drag</span>
      </>
    );

    await sub("Even a simple plate can generate lift");
    await sub("But the drag is very high");
    await sub("There are however better shapes");
    await sub("Like this aerodynamic profile", () => setProfile("2412"));
    await sub("It produces so much less drag");
    await sub("that we have to scale it 10x", () =>
      set({ dragMultiplier: 10 })
    );

    await sub("There is a common misconception regarding lift", () =>
      setChart({ hover: false, locked: "" })
    );
    await sub(
      "We assume that air particles require equal time",
      async () => {
        setMisconception({ show: true });
        await pause(750);
        setMisconception({ swap: true });
        await pause(1000);
        setMisconception({ constant: true });
      },
      50
    );
    await sub("to travel along the upper and lower surfaces");
    await sub("This forces the air above to speed up", async () => {
      setMisconception({ bigger: true });
      await pause(1000);
    });
    await sub("because it has a longer way to go along the upper side", () =>
      set({ flattenOutline: true })
    );
    await sub("Speed difference → pressure difference → lift");
    await sub("But here is a catch");
    await sub("That's physically impossible", () =>
      setMisconception({ error: true })
    );

    await sub(
      "A plate would generate no lift because it's symmetrical",
      async () => {
        setMisconception({ show: false });
        set({ flattenOutline: false });
        setProfile("04");
        await pause(1500);
        set({ flattenOutline: true });
      }
    );

    await sub("The components of an airfoil:", () => {
      set({ flattenOutline: false, showChord: false });
      setProfile("2412");
    });
    await sub(<p className="text-primary">outline</p>);
    await sub(<p className="text-base-content">chord line</p>, () =>
      set({ showChord: true })
    );
    await sub(<p className="text-secondary">camber line</p>, () =>
      set({ showCamber: true })
    );
    await sub(
      <>
        This is a&nbsp;<p className="text-primary">NACA 2412</p>&nbsp;profile
      </>
    );
    await sub("It belongs to the NACA 4-digit series family");
    await sub("This name is a simple mathematical relation", () =>
      set({ hoverPlane: true })
    );
    set({ hoverA: true });
    await pause(750);
    await show("max camber");
    await showDimension(["1412", "2412", "3412", "4412", "5412", "4412"]);
    set({ hoverA: false });
    hide();
    await pause(1000);

    set({ hoverB: true });
    await pause(750);
    await show("position of max camber");
    await showDimension(["4312", "4412", "4512", "4612", "4512", "4412"]);
    set({ hoverB: false });
    hide();
    await pause(1000);

    set({ hoverC: true });
    await pause(750);
    await show("position of max camber");
    await showDimension(["4415", "4418", "4421", "4424", "4412"]);
    hide();
    await pause(500);
    await sub("The max thickness is at 30% of chord");
    set({ hoverC: false });

    set({ hoverPlane: false, vectorSize: 1 });
    await pause(500);

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
      axis: false,
      axisCenter: true,
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

  return (
    <mesh>
      <IntroductionVectors opacity={opacity} />
      <IntroductionParticles opacity={opacity} />
    </mesh>
  );
};

export default Introduction;
