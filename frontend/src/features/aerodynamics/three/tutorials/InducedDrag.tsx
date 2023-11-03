import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SpringValue, animated, to, useSpring } from "@react-spring/three";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import { useWingStore } from "../../stores/useWing";
import useProfileCharts from "../../hooks/useProfileCharts";
import { useCameraStore } from "../../../common/three/stores/useCamera";
import Inputs3D from "../../../common/three/Inputs3D";
import MassSlider from "./MassSlider";
import SpeedSlider from "./SpeedSlider";
import useProfileTable, { Row } from "../../hooks/useProfileTable";
import { DoubleSide } from "three";
import useWingScale from "../../hooks/useWingScale";
import useSimpleWingModel from "../hooks/useSimpleWingModel";
import AnimatedLine from "../../../common/three/AnimatedLine";
import useInduced from "./useInduced";
import useProfileVisualizer from "../hooks/useProfileVisualizer";
import VectorNew from "../../../common/three/VectorNew";
import HoverableFormulaSimple from "../../../common/HoverableFormulaSimple";
import Formula from "../../../common/Formula";
import ProfileAirstreams from "../ProfileAirstreams";
import { PRESENTATION_MODE } from "../../../common/three/config";
import { useSubtitleStore } from "../../../common/subtitles/stores/useSubtitles";
import useAwaitClick from "../../../common/subtitles/hooks/useAwaitClick";

interface Props {
  opacity: SpringValue<number>;
}

const InducedDrag = ({ opacity }: Props) => {
  const { geometry, tipGeometry } = useSimpleWingModel();

  const profile = useWingStore((state) => state.profile);

  const { useProfileChartsStore } = useProfileCharts();
  const mass = useHoverProfileStore((state) => state.mass);
  const setMass = useHoverProfileStore((state) => state.setMass);
  const speed = useHoverProfileStore((state) => state.speed);
  const setSpeed = useHoverProfileStore((state) => state.setSpeed);

  const setProfile = useWingStore((state) => state.setProfile);
  const set = useHoverProfileStore((state) => state.set);
  const setChart = useProfileChartsStore((state) => state.set);
  const setCamera = useCameraStore((state) => state.set);
  const chart = useProfileChartsStore();

  const savedProfile = useRef("");
  const savedAngle = useRef(0);
  const savedLock = useRef<string | boolean>("");

  const { maxCz } = useProfileTable(1, profile) as Row;

  const [showLayout, setShowLayout] = useState(false);
  const [showVelocities, setShowVelocities] = useState(false);
  const [showLift, setShowLift] = useState(false);
  const [showEffectiveLift, setShowEffectiveLift] = useState(false);
  const [isWing, setIsWing] = useState(false);
  const [showDirection, setShowDirection] = useState(false);
  const [showDrag, setShowDrag] = useState(false);

  const { pathname, state } = useLocation();

  const setSub = useSubtitleStore((state) => state.setSub);
  const show = useSubtitleStore((state) => state.show);
  const hide = useSubtitleStore((state) => state.hide);

  const { scaleProfile } = useWingScale();

  const displaySub = async (
    next: any,
    text: string | React.ReactNode,
    duration = 3000,
    showInPresentation = false
  ) => {
    if (!PRESENTATION_MODE || showInPresentation) {
      setSub(text);
      show();
      await next({ delay: duration });
      hide();
      await next({ delay: 1000 });
    } else {
      await waitUserInput();
    }
  };
  const waitUserInput = useAwaitClick();

  const [animationSpring, animationSpringApi] = useSpring(
    () => ({
      from: {
        debug: true,
        wingLength: 10,
        wingOpacity: 0,
        wingVisible: false,
        tunnelVisible: false,
        tunnelOpacity: 0,
        spanVisible: false,
        spanOpacity: 0,
        streamOpacity: 0,
        vortexVisible: false,
        vortexOpacity: 0,
        speed: 1,
        epsilon: 0,
        downwashX: 0,
      },
      to: async (next) => {
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
          await next({ wingVisible: true });
          await next({ wingOpacity: 1 });
          await displaySub(
            next,
            "Which happens to be the same for a wing with an infinite span",
            4000
          );
          set({ showWeight: true });
          await next({ wingLength: 0.5 });
          await next({ tunnelVisible: true });
          await next({ tunnelOpacity: 0.5 });
          await displaySub(next, "Or one inside a wind tunnel", 2000);
          await next({ tunnelOpacity: 0 });
          await next({ tunnelVisible: false });
          setCamera({ spherical: [20, 70, 40] });
          await next({ wingLength: 1 });
          await next({ streamOpacity: 3 });
          await displaySub(
            next,
            "Airflow speeds up along the upper surface creating an area of low pressure"
          );
          await next({ spanVisible: true });
          await next({ spanOpacity: 1 });
          await displaySub(
            next,
            "This creates a flow from the lower wing surface to the upper around the wingtip",
            4000
          );
          await next({ streamOpacity: 0, spanOpacity: 0 });
          await next({ spanVisible: false });
          await next({ vortexVisible: true });
          await next({ vortexOpacity: 1 });
          await displaySub(
            next,
            "This combined with the speed of the freeflow creates a vortex at the wingtip",
            4000
          );
          setCamera({ spherical: [20, 70, 40] });
          await next({ delay: 2000 });
          setMass(1);
          await displaySub(
            next,
            "When we increase the angle of attack the vortex gets more violent",
            4000
          );
          setMass(0.5);
          await next({ delay: 1000 });
          setSpeed(1.25);
          await next({ delay: 1000 });
          await displaySub(
            next,
            "Increasing speed makes the vortex smaller",
            4000
          );
          setSpeed(1);
          setCamera({ center: [-5, -1, 7.5], spherical: [20, 90, 90] });
          await displaySub(
            next,
            "The vortex deflects the airflow behind the trailing edge downwards",
            4000
          );
          await displaySub(next, "This is called downwash");
          setCamera({ center: [-5, 0, 0], spherical: [20, 90, 0] });
          await next({ delay: 500 });
          await next({ vortexOpacity: 0 });
          await next({ vortexVisible: false });
          setShowLift(true);
          setShowDirection(true);
          await displaySub(next, "In a 2D world lift is always vertical");
          setShowVelocities(true);
          await displaySub(next, "An airfoil produces no downwash");
          setIsWing(true);
          await next({ vortexVisible: true });
          await next({ vortexOpacity: 1 });
          await displaySub(
            next,
            "The downwash angles the relative airflow backwards",
            4000
          );
          await displaySub(next, "Lift is always perpendicular to the airflow");
          setShowDrag(true);
          await displaySub(
            next,
            <p className="flex">
              The x component of
              <Formula className="text-primary mt-1" tex="\: L \:" /> is called
              &nbsp;<p className="text-error">induced drag</p>
            </p>,
            4000,
            true
          );
          await waitUserInput();
          await displaySub(
            next,
            <p className="flex">
              It's inveresely proportional to <Formula tex="\: V^2" />
            </p>,
            4000
          );
          setShowEffectiveLift(true);
          await displaySub(
            next,
            <p className="flex">
              The y component of
              <Formula className="text-primary mt-1" tex="\: L \:" /> is the
              &nbsp;<p className="text-secondary">effective lift</p>
            </p>,
            4000,
            true
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
          setChart({
            hover: false,
            xHover: savedAngle.current,
            locked: savedLock.current,
          });
          setProfile(savedProfile.current ? savedProfile.current : profile);
          setShowLayout(false);
          hide();
        }
      },
    }),
    [pathname]
  );
  const { spanwise, vortex } = useInduced();
  const { profileSpring } = useProfileVisualizer();

  const spanWiseSpeed = 0.2 * chart.yHover * speed;
  const vortexSpeed =
    5 * Math.sqrt(spanWiseSpeed * spanWiseSpeed + 0.01 * speed * speed);
  const downWashAngle = Math.atan(spanWiseSpeed / speed);
  const lift = chart.yHover * speed * speed * 1.25;

  useEffect(() => {
    if (pathname === "/aerodynamics/inducedDrag") {
      setChart({ yHover: Math.min(maxCz, mass / (speed * speed)) });
      animationSpringApi.start({
        speed,
        epsilon: isWing ? Math.atan(spanWiseSpeed / speed) : 0,
        downwashX: speed * 3.5,
      });
    }
  }, [mass, speed, isWing, spanWiseSpeed]);

  return (
    <>
      <Inputs3D gridPositionX={-1.5} show={showLayout}>
        <MassSlider value={mass} setter={setMass} />
        <SpeedSlider value={speed} setter={setSpeed} />
      </Inputs3D>
      <spotLight position={[-15, -2, 20]} intensity={0.3} />
      <mesh position-x={-8.5} scale={scaleProfile}>
        <animated.mesh rotation-z={profileSpring.angle} position-x={0.25}>
          <mesh position-x={-0.25}>
            <animated.mesh
              position-x={0.4}
              rotation-z={Math.PI / 2}
              visible={animationSpring.tunnelVisible}
            >
              <cylinderGeometry args={[0.5, 0.5, 1.1, 32, 1, true]} />
              <animated.meshStandardMaterial
                color={"lightgray"}
                side={DoubleSide}
                metalness={1}
                transparent
                opacity={to(
                  [opacity, animationSpring.tunnelOpacity],
                  (o, tunnelOpacity) => o * tunnelOpacity
                )}
              />
            </animated.mesh>
            <animated.mesh visible={animationSpring.spanVisible}>
              <AnimatedLine
                points={spanwise}
                style="dotted"
                color="grid"
                offset={spanWiseSpeed}
                opacity={to(
                  [opacity, animationSpring.spanOpacity],
                  (opacity, spanOpacity) => opacity * spanOpacity
                )}
              />
            </animated.mesh>
            <mesh position-z={0.95}>
              <ProfileAirstreams
                opacity={animationSpring.streamOpacity}
                show={true}
              />
            </mesh>
            <animated.mesh
              position-x={0.25}
              position-z={1}
              visible={animationSpring.vortexVisible}
            >
              <animated.mesh
                scale-x={animationSpring.speed}
                rotation-z={profileSpring.angle.to(
                  (a) => -a - (3 * Math.PI) / 180
                )}
              >
                <AnimatedLine
                  points={vortex}
                  style="vortex"
                  color="grid"
                  offset={vortexSpeed}
                  opacity={to(
                    [opacity, animationSpring.vortexOpacity],
                    (opacity, vortexOpacity) => opacity * vortexOpacity
                  )}
                />
                <mesh rotation-x={Math.PI}>
                  <AnimatedLine
                    points={vortex}
                    style="vortex"
                    color="grid"
                    offset={vortexSpeed}
                    opacity={to(
                      [opacity, animationSpring.vortexOpacity],
                      (opacity, vortexOpacity) => opacity * vortexOpacity
                    )}
                  />
                </mesh>
              </animated.mesh>
            </animated.mesh>
            <animated.mesh
              scale-z={animationSpring.wingLength}
              visible={animationSpring.wingVisible}
            >
              <mesh geometry={geometry}>
                <animated.meshStandardMaterial
                  color={"lightgray"}
                  side={DoubleSide}
                  metalness={1}
                  transparent
                  opacity={to(
                    [opacity, animationSpring.wingOpacity],
                    (o, wingOpacity) => o * wingOpacity
                  )}
                />
              </mesh>
              <mesh geometry={tipGeometry}>
                <animated.meshStandardMaterial
                  color={"lightgray"}
                  side={DoubleSide}
                  metalness={1}
                  transparent
                  opacity={to(
                    [opacity, animationSpring.wingOpacity],
                    (o, wingOpacity) => o * wingOpacity
                  )}
                />
              </mesh>
            </animated.mesh>
            <animated.mesh
              position-x={1}
              position-z={1}
              rotation-z={profileSpring.angle.to((a) => -a)}
            >
              <mesh scale={1 / scaleProfile}>
                <VectorNew
                  x={speed}
                  show={showVelocities}
                  opacity={opacity}
                  color="primary"
                >
                  <HoverableFormulaSimple name="Freeflow speed" tex={`V`} />
                </VectorNew>
                <animated.mesh position-x={animationSpring.downwashX}>
                  <VectorNew
                    x={0}
                    y={isWing ? -spanWiseSpeed : 0}
                    show={showVelocities}
                    opacity={opacity}
                    color="error"
                  >
                    <HoverableFormulaSimple name="Downwash" tex={`w`} />
                  </VectorNew>
                </animated.mesh>
              </mesh>
              <animated.mesh rotation-z={animationSpring.epsilon.to((e) => -e)}>
                <AnimatedLine
                  points={[
                    [-1, 0, 0.01],
                    [1, 0, 0.01],
                  ]}
                  style="dotted"
                  color="grid"
                  opacity={opacity.to((o) => (showDirection ? o * 0.25 : 0))}
                />
              </animated.mesh>
            </animated.mesh>
          </mesh>
        </animated.mesh>
        <mesh scale={1 / scaleProfile} position-x={0.25} position-z={1}>
          <VectorNew
            x={isWing ? lift * Math.sin(downWashAngle) : 0}
            y={isWing ? lift * Math.cos(downWashAngle) : lift}
            show={showLift}
            opacity={opacity}
            color="primary"
          >
            <HoverableFormulaSimple name="Lift" tex={`L`} />
          </VectorNew>
          <VectorNew
            x={lift * Math.sin(downWashAngle)}
            show={showDrag}
            opacity={opacity}
            color="error"
          >
            <HoverableFormulaSimple name="Induced Drag" tex={`D_i`} />
          </VectorNew>
          <VectorNew
            y={lift * Math.cos(downWashAngle)}
            show={showEffectiveLift}
            opacity={opacity}
            color="secondary"
          >
            <div className="mr-16 mt-10">
              <HoverableFormulaSimple name="Effective Lift" tex={`L_{eff}`} />
            </div>
          </VectorNew>
        </mesh>
      </mesh>
    </>
  );
};

export default InducedDrag;
