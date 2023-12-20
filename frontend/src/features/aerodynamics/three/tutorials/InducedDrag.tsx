import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { animated, useSpring } from "@react-spring/three";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import { useWingStore } from "../../stores/useWing";
import useProfileCharts from "../../hooks/useProfileCharts";
import { useCameraStore } from "../../../common/three/stores/useCamera";
import Inputs3D from "../../../common/three/Inputs3D";
import MassSlider from "./MassSlider";
import SpeedSlider from "./SpeedSlider";
import useWingScale from "../../hooks/useWingScale";
import useProfileVisualizer from "../hooks/useProfileVisualizer";
import Formula from "../../../common/Formula";
import { useSubtitleStore } from "../../../common/subtitles/stores/useSubtitles";
import useSubs from "../../../common/subtitles/hooks/useSubs";
import InducedDragTunnel from "./InducedDragTunnel";
import { useInducedDragStore } from "./stores/useInducedDrag";
import InducedDragWing from "./InducedDragWing";
import InducedDragSpan from "./InducedDragSpan";
import InducedDragForces from "./InducedDragForces";
import InducedDragVelocities from "./InducedDragVelocities";
import InducedDragVortex from "./InducedDragVortex";
import useAnimation from "../../../common/subtitles/hooks/useAnimation";
import { ElementProps } from "../../../navigation/Route";
import InducedDragSigns from "./InducedDragSigns";

const InducedDrag = ({ opacity, visible }: ElementProps) => {
  const setReynolds = useWingStore((state) => state.setReynolds);

  const { useProfileChartsStore } = useProfileCharts();
  const mass = useHoverProfileStore((state) => state.mass);
  const setMass = useHoverProfileStore((state) => state.setMass);

  const set = useHoverProfileStore((state) => state.set);
  const setInduced = useInducedDragStore((state) => state.set);

  const setChart = useProfileChartsStore((state) => state.set);
  const setCamera = useCameraStore((state) => state.set);

  const [showLayout, setShowLayout] = useState(false);

  const { sub, waitForClick: wait } = useSubs();

  const animation = async () => {
    await sub("We have studied the aerodynamics of a 2D airfoil");
    setCamera({ center: [-5, 0, 0], spherical: [20, 80, -80] });
    await wait(500);
    setInduced({ wing: true });
    await sub("Which happen to be the same for a wing with an infinite span");
    set({ showWeight: true });
    setInduced({ wingspan: 0.5 });
    await wait(500);
    setInduced({ tunnel: true });
    await sub("Or one inside of a wind tunnel");
    setInduced({ tunnel: false });
    await wait(500);

    setCamera({ spherical: [20, 70, 40] });
    setInduced({ wingspan: 1 });
    await wait(500);
    await sub(
      "Airflow speeds up along the upper surface creating an area of low pressure",
      () => {
        setInduced({ airstreamOpacity: 2, signs: true });
      }
    );
    await sub(
      "This creates a flow from the lower wing surface to the upper around the wingtip",
      () => {
        setInduced({ span: true, moveSigns: true });
      }
    );
    setInduced({ span: false, signs: false, airstreamOpacity: 0 });
    await wait(500);
    setInduced({ vortex: true });
    await sub(
      "This combined with the speed of the freeflow creates a vortex at the wingtip"
    );
    setCamera({ spherical: [20, 70, 40] });
    await wait(500);
    setMass(1);
    await sub(
      "When we increase the angle of attack the vortex gets more violent"
    );
    setMass(0.5);
    await wait(500);
    setReynolds(1.25 * 6);
    await wait(500);
    await sub("Increasing speed makes the vortex smaller");
    setReynolds(1 * 6);
    setCamera({ center: [-5, -1, 7.5], spherical: [20, 90, 90] });
    await sub(
      "The vortex deflects the airflow behind the trailing edge downwards"
    );
    await sub("This is called downwash");
    setCamera({ center: [-5, 0, 0], spherical: [20, 90, 0] });
    await wait(500);
    setInduced({ vortex: false });
    await wait(500);
    setInduced({ lift: true, direction: true });
    await sub("In a 2D world lift is always vertical");
    setInduced({ velocities: true });
    await sub("An airfoil produces no downwash");
    setInduced({ isWing: true });
    setInduced({ vortex: true });
    await sub("The downwash angles the relative airflow backwards");
    await sub("Lift is always perpendicular to the airflow");
    setInduced({ drag: true });
    await sub(
      <p className="flex">
        The x component of
        <Formula className="text-primary mt-1" tex="\: L \:" /> is called &nbsp;
        <p className="text-error">induced drag</p>
      </p>
    );
    await sub(
      <p className="flex">
        It's inveresely proportional to <Formula tex="\: V^2" />
      </p>
    );
    setInduced({ effLift: true });
    await sub(
      <p className="flex">
        The y component of
        <Formula className="text-primary mt-1" tex="\: L \:" /> is the &nbsp;
        <p className="text-secondary">effective lift</p>
      </p>
    );
    await sub("Due to the downwash it's slightly smaller");
    await sub(
      "So we actually need a steeper angle of attack to achieve the same lift in a wing"
    );
    setShowLayout(true);
  };

  const cleanup = () => {
    set({ showWeight: false, mass: 1, speed: 1, showVectors: true });
    setInduced({
      tunnel: false,
      wing: false,
      wingspan: 10,
      span: false,
      airstreamOpacity: 0,
      vortex: false,
      isWing: false,
      lift: false,
      direction: false,
      velocities: false,
      drag: false,
      effLift: false,
    });
    setShowLayout(false);
  };

  useAnimation(
    animation,
    cleanup,
    () => {
      set({ showVectors: false });
      setChart({ hover: true, locked: "Coefficient of Drag" });
    },
    visible
  );

  const { scaleProfile } = useWingScale();
  const { profileSpring } = useProfileVisualizer();

  return (
    <>
      <Inputs3D gridPositionX={-1.5} show={showLayout}>
        <MassSlider value={mass} setter={setMass} />
        <SpeedSlider />
      </Inputs3D>
      <spotLight position={[-15, -2, 20]} intensity={0.3} />
      <mesh position-x={-8} scale={scaleProfile}>
        <InducedDragTunnel opacity={opacity} />
        <animated.mesh rotation-z={profileSpring.angle} position-x={0.25}>
          <mesh position-x={-0.25}>
            <InducedDragSpan opacity={opacity} />
            <InducedDragSigns opacity={opacity} />
            <InducedDragVortex opacity={opacity} />
            <InducedDragWing opacity={opacity} />
            <InducedDragVelocities opacity={opacity} />
          </mesh>
        </animated.mesh>
        <InducedDragForces opacity={opacity} />
      </mesh>
    </>
  );
};

export default InducedDrag;
