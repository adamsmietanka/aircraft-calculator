import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SpringValue, animated, to, useSpring } from "@react-spring/three";
import AnimatedHtml from "../../../common/three/AnimatedHtml";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import { useWingStore } from "../../stores/useWing";
import useProfileCharts from "../../hooks/useProfileCharts";
import { useCameraStore } from "../../../common/three/stores/useCamera";
import Inputs3D from "../../../common/three/Inputs3D";
import MassSlider from "./MassSlider";
import SpeedSlider from "./SpeedSlider";
import LineChart from "../../../common/three/LineChart";
import useProfileTable, { Row } from "../../hooks/useProfileTable";
import Formula from "../../../common/Formula";
import useWingModel from "../hooks/useWingModel";
import { DoubleSide, Mesh, SpotLightHelper } from "three";
import { useSubtitleStore } from "../../../navigation/stores/useSubtitles";
import useWingScale from "../../hooks/useWingScale";
import useSimpleWingModel from "../hooks/useSimpleWingModel";
import { useHelper } from "@react-three/drei";
import AnimatedLine from "../../../common/three/AnimatedLine";
import useInduced from "./useInduced";
import useProfileVisualizer from "../hooks/useProfileVisualizer";
import a1_0M from "../../../../utils/steerCalculation/aCoefficients/a1_0M";

interface Props {
  opacity: SpringValue<number>;
}

const InducedDrag = ({ opacity }: Props) => {
  const { geometry, tipGeometry } = useSimpleWingModel();
  const lightRef = useRef<Mesh>(null!);
  // useHelper(lightRef, SpotLightHelper);

  const profile = useWingStore((state) => state.profile);
  const chord = useWingStore((state) => state.chord);
  const span = useWingStore((state) => state.span);

  const { pointsCl, pointsCd, useProfileChartsStore } = useProfileCharts();
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

  useEffect(() => {
    setChart({ yHover: Math.min(maxCz, mass / (speed * speed)) });
    animationSpringApi.start({ speed });
  }, [mass, speed]);

  const [showLayout, setShowLayout] = useState(false);

  const { pathname, state } = useLocation();

  const [subtitle, setSubtitle] = useState<string | React.ReactNode>("");
  const [showSubtitle, setShowSubtitle] = useState(false);

  const setSub = useSubtitleStore((state) => state.setSub);
  const show = useSubtitleStore((state) => state.show);
  const hide = useSubtitleStore((state) => state.hide);

  const { scaleProfile } = useWingScale();

  const displaySub = async (
    next: any,
    text: string | React.ReactNode,
    duration = 3000
  ) => {
    setSub(text);
    show();
    await next({ delay: duration });
    hide();
    await next({ delay: 1500 });
  };

  const showSub = (text: string | React.ReactNode) => {
    setSubtitle(text);
    setShowSubtitle(true);
  };

  const hideSub = () => setShowSubtitle(false);

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
        vortexVisible: false,
        vortexOpacity: 0,
        speed: 1,
      },
      to: async (next) => {
        if (pathname === "/aerodynamics/inducedDrag") {
          savedProfile.current = profile;
          savedAngle.current = chart.xHover;
          savedLock.current = chart.locked;

          await next({ delay: 2000 });
          // setChart({ yHover: 0.5 });
          setChart({ hover: true, locked: "Coefficient of Drag" });
          // await displaySub(
          //   next,
          //   "We have studied the aerodynamics of a 2D airfoil",
          //   3000
          // );
          setCamera({ center: [-5, 0, 0], spherical: [20, 80, -80] });
          await next({ delay: 500 });
          await next({ wingVisible: true });
          await next({ wingOpacity: 0.5 });
          // await displaySub(
          //   next,
          //   "Which is also true for a wing with an infinite span",
          //   4000
          // );
          set({ showWeight: true });
          await next({ wingLength: 0.5 });
          await next({ tunnelVisible: true });
          await next({ tunnelOpacity: 0.5 });
          // await displaySub(next, "Or one inside a wind tunnel", 2000);
          await next({ tunnelOpacity: 0 });
          await next({ tunnelVisible: false });
          setCamera({ spherical: [20, 70, 40] });
          await next({ wingLength: 1 });
          // await displaySub(
          //   next,
          //   "Airflow speeds up along the upper surface creating an area of low pressure",
          //   3000
          // );
          await next({ spanVisible: true });
          await next({ spanOpacity: 1 });
          // await displaySub(
          //   next,
          //   "This creates a flow from the lower wing surface to the upper around the wingtip",
          //   4000
          // );
          await next({ vortexVisible: true });
          await next({ vortexOpacity: 1 });
          // await displaySub(
          //   next,
          //   "This combined with the speed of the freeflow creates a vortex at the wingtip",
          //   4000
          // );
          setCamera({ center: [-5, -1, 7.5], spherical: [20, 90, 90] });
          // await displaySub(
          //   next,
          //   "The vortex deflects the airflow behind the trailing edge downwards",
          //   4000
          // );
          setCamera({ center: [-5, 0, 0], spherical: [20, 70, 40] });
          await next({ delay: 2000 });
          setMass(1);
          // await displaySub(
          //   next,
          //   "When we increase the angle of attack the vortex gets more violent",
          //   4000
          // );
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
          await next({ delay: 500 });
          // await displaySub(
          //   next,
          //   <div className="flex">
          //     <Formula className={`text-xl text-error`} tex={`W`} />
          //     <Formula className={`text-xl`} tex={`=`} />
          //     <Formula className={`text-xl text-primary`} tex={`F_L`} />
          //   </div>
          // );
          // await displaySub(
          //   next,
          //   <div className="flex items-center h-20">
          //     <Formula className={`text-xl`} tex={`mg`} />
          //     <Formula className={`text-xl`} tex={`=`} />
          //     <Formula
          //       className={`text-xl`}
          //       tex={`\\frac{1}{2} \\rho V^2 S C_L`}
          //     />
          //   </div>
          // );
          // await displaySub(next, "So our coefficient of lift must be equal to");
          // await displaySub(
          //   next,
          //   <div className="flex items-center h-20">
          //     <Formula className={`text-xl text-primary`} tex={`C_L`} />
          //     <Formula className={`text-xl`} tex={`=`} />
          //     <Formula
          //       className={`text-xl`}
          //       tex={`\\frac{2mg}{\\rho V^2 S }`}
          //     />
          //   </div>,
          //   4000
          // );
          setCamera({ center: [-5, 0, 0], spherical: [20, 90, 0] });
          setShowLayout(true);
        } else if (state.previousPath === "/aerodynamics/inducedDrag") {
          set({ showWeight: false, mass: 1, speed: 1 });
          setChart({
            hover: false,
            xHover: savedAngle.current,
            locked: savedLock.current,
          });
          setProfile(savedProfile.current ? savedProfile.current : profile);
          setShowLayout(false);
        }
      },
    }),
    [pathname]
  );
  const { spanwise, vortex } = useInduced();
  const { profileSpring } = useProfileVisualizer();
  const spanWiseSpeed = 0.3 * chart.yHover * speed;
  const vortexSpeed = Math.sqrt(
    spanWiseSpeed * spanWiseSpeed + 0.01 * speed * speed
  );

  return (
    <>
      <mesh position={[-4.5, -3, 0]}>
        <AnimatedHtml show={showSubtitle}>
          <div className="flex justify-center">{subtitle}</div>
        </AnimatedHtml>
      </mesh>
      <Inputs3D gridPositionX={-1.3} show={showLayout}>
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
      <spotLight ref={lightRef} position={[-20, -2, 20]} intensity={0.2} />
      <mesh position-x={-8.5} scale={scaleProfile}>
        <animated.mesh rotation-z={profileSpring.angle} position-x={0.25}>
          <mesh position-x={-0.25}>
            <animated.mesh
              position-x={0.5}
              rotation-z={Math.PI / 2}
              visible={animationSpring.tunnelVisible}
            >
              <cylinderGeometry args={[0.5, 0.5, 1, 32, 1, true]} />
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
                opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
              />
            </animated.mesh>
            <animated.mesh
              position-x={0.95}
              position-z={1}
              scale-x={animationSpring.speed}
              rotation-z={(-2 * Math.PI) / 180}
              visible={animationSpring.vortexVisible}
            >
              <AnimatedLine
                points={vortex}
                style="dotted"
                color="airstream"
                offset={vortexSpeed}
                opacity={opacity.to((o) => (true ? o * 0.2 : 0))}
              />
              <mesh rotation-x={Math.PI}>
                <AnimatedLine
                  points={vortex}
                  style="dotted"
                  color="airstream"
                  offset={vortexSpeed}
                  opacity={opacity.to((o) => (true ? o * 0.2 : 0))}
                />
              </mesh>
            </animated.mesh>
            <mesh scale={1}>
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
            </mesh>
          </mesh>
        </animated.mesh>
      </mesh>
      {/* <AnimatedHtml rotation-y={Math.PI / 2}>LOW</AnimatedHtml> */}
    </>
  );
};

export default InducedDrag;
