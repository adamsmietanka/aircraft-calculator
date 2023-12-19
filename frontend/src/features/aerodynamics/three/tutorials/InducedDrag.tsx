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
import { Props } from "../../../common/types/three";
import InducedDragSpan from "./InducedDragSpan";
import InducedDragForces from "./InducedDragForces";
import InducedDragVelocities from "./InducedDragVelocities";
import InducedDragVortex from "./InducedDragVortex";

const InducedDrag = ({ opacity }: Props) => {
  const profile = useWingStore((state) => state.profile);
  const setReynolds = useWingStore((state) => state.setReynolds);

  const { useProfileChartsStore } = useProfileCharts();
  const mass = useHoverProfileStore((state) => state.mass);
  const setMass = useHoverProfileStore((state) => state.setMass);

  const setProfile = useWingStore((state) => state.setProfile);
  const set = useHoverProfileStore((state) => state.set);
  const setInduced = useInducedDragStore((state) => state.set);

  const setChart = useProfileChartsStore((state) => state.set);
  const setCamera = useCameraStore((state) => state.set);
  const chart = useProfileChartsStore();

  const savedProfile = useRef("");
  const savedAngle = useRef(0);
  const savedLock = useRef<string | boolean>("");

  const [showLayout, setShowLayout] = useState(false);

  const { pathname, state } = useLocation();

  const hideSubs = useSubtitleStore((state) => state.hide);
  const { displaySub } = useSubs();

  const { scaleProfile } = useWingScale();

  const [animationSpring, animationSpringApi] = useSpring(
    () => ({
      from: { debug: true },
      to: async (next: any) => {
        if (pathname === "/aerodynamics/inducedDrag") {
          savedProfile.current = profile;
          savedAngle.current = chart.xHover;
          savedLock.current = chart.locked;

          set({ showVectors: false });
          setChart({ hover: true, locked: "Coefficient of Drag" });
          await next({ delay: 2000 });
          await displaySub(
            next,
            "We have studied the aerodynamics of a 2D airfoil"
          );
          setCamera({ center: [-5, 0, 0], spherical: [20, 80, -80] });
          await next({ delay: 500 });
          setInduced({ wing: true });
          await displaySub(
            next,
            "Which happen to be the same for a wing with an infinite span",
            4000
          );
          set({ showWeight: true });
          setInduced({ wingspan: 0.5 });
          await next({ delay: 500 });
          setInduced({ tunnel: true });
          await displaySub(next, "Or one inside of a wind tunnel", 2000);
          setInduced({ tunnel: false });
          await next({ delay: 500 });

          setCamera({ spherical: [20, 70, 40] });
          setInduced({ wingspan: 1 });
          await next({ delay: 500 });
          setInduced({ airstreamOpacity: 3 });
          await displaySub(
            next,
            "Airflow speeds up along the upper surface creating an area of low pressure"
          );
          setInduced({ span: true });
          await displaySub(
            next,
            "This creates a flow from the lower wing surface to the upper around the wingtip",
            4000
          );
          setInduced({ span: false, airstreamOpacity: 0 });
          await next({ delay: 500 });
          setInduced({ vortex: true });
          await displaySub(
            next,
            "This combined with the speed of the freeflow creates a vortex at the wingtip",
            4000
          );
          setCamera({ spherical: [20, 70, 40] });
          await next({ delay: 500 });
          setMass(1);
          await displaySub(
            next,
            "When we increase the angle of attack the vortex gets more violent",
            4000
          );
          setMass(0.5);
          await next({ delay: 500 });
          setReynolds(1.25 * 6);
          await next({ delay: 500 });
          await displaySub(
            next,
            "Increasing speed makes the vortex smaller",
            4000
          );
          setReynolds(1 * 6);
          setCamera({ center: [-5, -1, 7.5], spherical: [20, 90, 90] });
          await displaySub(
            next,
            "The vortex deflects the airflow behind the trailing edge downwards",
            4000
          );
          await displaySub(next, "This is called downwash");
          setCamera({ center: [-5, 0, 0], spherical: [20, 90, 0] });
          await next({ delay: 500 });
          setInduced({ vortex: false });
          await next({ delay: 500 });
          setInduced({ lift: true, direction: true });
          await displaySub(next, "In a 2D world lift is always vertical");
          setInduced({ velocities: true });
          await displaySub(next, "An airfoil produces no downwash");
          setInduced({ isWing: true });
          setInduced({ vortex: true });
          await displaySub(
            next,
            "The downwash angles the relative airflow backwards",
            4000
          );
          await displaySub(next, "Lift is always perpendicular to the airflow");
          setInduced({ drag: true });
          await displaySub(
            next,
            <p className="flex">
              The x component of
              <Formula className="text-primary mt-1" tex="\: L \:" /> is called
              &nbsp;<p className="text-error">induced drag</p>
            </p>,
            4000
          );
          await displaySub(
            next,
            <p className="flex">
              It's inveresely proportional to <Formula tex="\: V^2" />
            </p>,
            4000
          );
          setInduced({ effLift: true });
          await displaySub(
            next,
            <p className="flex">
              The y component of
              <Formula className="text-primary mt-1" tex="\: L \:" /> is the
              &nbsp;<p className="text-secondary">effective lift</p>
            </p>,
            4000
          );
          await displaySub(next, "Due to the downwash it's slightly smaller");
          await displaySub(
            next,
            "So we actually need a steeper angle of attack to achieve the same lift in a wing",
            4000
          );
          setShowLayout(true);
        } else if (state.previousPath === "/aerodynamics/inducedDrag") {
          set({ showWeight: false, mass: 1, speed: 1, showVectors: true });
          setInduced({
            tunnel: false,
            wing: false,
            wingspan: 10,
            span: false,
            spanSpeed: 1,
            airstreamOpacity: 0,
            vortex: false,
            isWing: false,
            lift: false,
            direction: false,
            velocities: false,
            drag: false,
            effLift: false,
          });
          setChart({
            hover: false,
            xHover: savedAngle.current,
            locked: savedLock.current,
          });
          setProfile(savedProfile.current ? savedProfile.current : profile);
          setShowLayout(false);
          hideSubs();
        }
      },
    }),
    [pathname]
  );
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
          <InducedDragSpan opacity={opacity} />
          <mesh position-x={-0.25}>
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
