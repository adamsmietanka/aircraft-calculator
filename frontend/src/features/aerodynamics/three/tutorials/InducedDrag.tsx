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
import { useSubtitleStore } from "../../../navigation/stores/useSubtitles";
import useWingScale from "../../hooks/useWingScale";
import useSimpleWingModel from "../hooks/useSimpleWingModel";
import AnimatedLine from "../../../common/three/AnimatedLine";
import useInduced from "./useInduced";
import useProfileVisualizer from "../hooks/useProfileVisualizer";
import VectorNew from "../../../common/three/VectorNew";
import HoverableFormulaSimple from "../../../common/HoverableFormulaSimple";
import Formula from "../../../common/Formula";
import useAwaitClick from "../../../navigation/hooks/useAwaitClick";
import ProfileAirstreams from "../ProfileAirstreams";
import { PRESENTATION_MODE } from "../../../common/three/config";
import timeout from "../../../common/utils/timeout";

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
  const [updateLift, setUpdateLift] = useState(false);
  const [showDirection, setShowDirection] = useState(false);
  const [showDrag, setShowDrag] = useState(false);

  const { pathname, state } = useLocation();

  const setSub = useSubtitleStore((state) => state.setSub);
  const show = useSubtitleStore((state) => state.show);
  const hide = useSubtitleStore((state) => state.hide);

  const { scaleProfile } = useWingScale();

  const displaySub = async (
    text: string | React.ReactNode,
    duration = 3000,
    showInPresentation = false
  ) => {
    if (!PRESENTATION_MODE || showInPresentation) {
      setSub(text);
      show();
      await timeout(duration);
      hide();
      await timeout(1000);
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
          await timeout(2000);
          await displaySub("We have studied the aerodynamics of a 2D airfoil");
          await waitUserInput();
          setCamera({ center: [-5, 0, 0], spherical: [20, 80, -80] });
          await timeout(500);
          await next({ wingVisible: true });
          await next({ wingOpacity: 1 });
          await displaySub(
            "Which happens to be the same for a wing with an infinite span",
            4000
          );
          await waitUserInput();
          set({ showWeight: true });
          await next({ wingLength: 0.5 });
          await next({ tunnelVisible: true });
          await next({ tunnelOpacity: 0.5 });
          await displaySub("Or one inside a wind tunnel", 2000);
          await waitUserInput();
          await next({ tunnelOpacity: 0 });
          await next({ tunnelVisible: false });
          setCamera({ spherical: [20, 70, 40] });
          await next({ wingLength: 1 });
          await next({ streamOpacity: 3 });
          await displaySub(
            "Airflow speeds up along the upper surface creating an area of low pressure"
          );
          await waitUserInput();
          await next({ spanVisible: true });
          await next({ spanOpacity: 1 });
          await displaySub(
            "This creates a flow from the lower wing surface to the upper around the wingtip",
            4000
          );
          await waitUserInput();
          await next({ streamOpacity: 0, spanOpacity: 0 });
          await next({ spanVisible: false });
          await next({ vortexVisible: true });
          await next({ vortexOpacity: 1 });
          await displaySub(
            "This combined with the speed of the freeflow creates a vortex at the wingtip",
            4000
          );
          await waitUserInput();
          setCamera({ spherical: [20, 70, 40] });
          !PRESENTATION_MODE && (await timeout(2000));
          setMass(1);
          await displaySub(
            "When we increase the angle of attack the vortex gets more violent",
            4000
          );
          await waitUserInput();
          setMass(0.5);
          await timeout(1000);
          await waitUserInput();
          setSpeed(1.3);
          await timeout(1000);
          await displaySub("Increasing speed makes the vortex smaller", 4000);
          await waitUserInput();
          setSpeed(1);
          await timeout(500);
          setCamera({ center: [-5, -1, 7.5], spherical: [20, 90, 90] });
          await displaySub(
            "The vortex deflects the airflow behind the trailing edge downwards",
            4000
          );
          await waitUserInput();
          await displaySub("This is called downwash");
          setCamera({ center: [-5, 0, 0], spherical: [20, 90, 0] });
          await timeout(500);
          await next({ vortexOpacity: 0 });
          await next({ vortexVisible: false });
          setShowLift(true);
          setShowDirection(true);
          await displaySub("In a 2D world lift is always vertical");
          await waitUserInput();
          setShowVelocities(true);
          await displaySub("An airfoil produces no downwash");
          await waitUserInput();
          setUpdateLift(true);
          await next({ vortexVisible: true });
          await next({ vortexOpacity: 1 });
          await displaySub(
            "The downwash angles the relative airflow backwards",
            4000
          );
          await waitUserInput();
          await displaySub("Lift is always perpendicular to the airflow");
          setShowDrag(true);
          await displaySub(
            <p className="flex">
              The x component of
              <Formula className="text-primary mt-1" tex="\: F_L \:" /> is
              called &nbsp;<p className="text-error">induced drag</p>
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
          await displaySub(
            next,
            <p className="flex">
              The y component of
              <Formula className="text-primary mt-1" tex="\: F_L \:" /> is the
              "true" lift
            </p>,
            4000,
            true
          );
          await waitUserInput();
          await displaySub("Due to the downwash it's slightly smaller");
          await displaySub(
            "So we actually need a steeper angle of attack to achieve the same lift in a wing",
            4000
          );
          setShowLayout(true);
        } else if (state.previousPath === "/aerodynamics/inducedDrag") {
          set({ showWeight: false, mass: 0.5, speed: 1, showVectors: true });
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
        epsilon: updateLift ? Math.atan(spanWiseSpeed / speed) : 0,
        downwashX: speed * 3.5,
      });
    }
  }, [mass, speed, updateLift, spanWiseSpeed]);

  return (
    <>
      <Inputs3D gridPositionX={-1.5} show={showLayout}>
        <MassSlider
          label="Mass"
          value={mass}
          min={0.3}
          step={0.1}
          max={0.7}
          setter={setMass}
        />
        <SpeedSlider label="Speed" value={speed} setter={setSpeed} />
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
                  color="airstream"
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
                    color="airstream"
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
                    y={updateLift ? -spanWiseSpeed : 0}
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
                  color="airstream"
                  opacity={opacity.to((o) => (showDirection ? o * 0.25 : 0))}
                />
              </animated.mesh>
            </animated.mesh>
          </mesh>
        </animated.mesh>
        <mesh scale={1 / scaleProfile} position-x={0.25} position-z={1}>
          <animated.mesh></animated.mesh>
          <VectorNew
            x={updateLift ? lift * Math.sin(downWashAngle) : 0}
            y={lift * Math.cos(downWashAngle)}
            show={showLift}
            opacity={opacity}
            color="primary"
          >
            <HoverableFormulaSimple name="Freeflow speed" tex={`F_L`} />
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
            show={false}
            opacity={opacity}
            color="error"
          >
            <HoverableFormulaSimple name="Effective Lift" tex={`F_{L_{eff}}`} />
          </VectorNew>
        </mesh>
      </mesh>
    </>
  );
};

export default InducedDrag;
