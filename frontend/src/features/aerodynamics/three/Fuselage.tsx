import { Instance, Instances, PresentationControls } from "@react-three/drei";
import { SpringValue, animated, easings, useSpring } from "@react-spring/three";
import { usePlaneStore } from "../stores/usePlane";
import { useWingStore } from "../stores/useWing";
import WingModel from "./WingModel";
import FuseModel from "./FuseModel";
import usePlaneAerodynamics from "../hooks/usePlaneAerodynamics";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import MeasurementsFuse from "./MeasurementsFuse";
import StabilizerVertical from "./StabilizerVertical";
import StabilizerHorizontal from "./StabilizerHorizontal";
import { useResultsChartStore } from "../hooks/useResultsChart";

interface Props {
  opacity: SpringValue<number>;
}

const Fuselage = ({ opacity }: Props) => {
  const fuselage = usePlaneStore((state) => state.fuselage);
  const configuration = usePlaneStore((state) => state.configuration);
  const length = usePlaneStore((state) => state.length);
  const wingX = usePlaneStore((state) => state.wingX);

  const verticalX = usePlaneStore((state) => state.verticalX);
  const verticalY = usePlaneStore((state) => state.verticalY);
  const fuselageDistance = usePlaneStore((state) => state.fuselageDistance);

  const MAC = useWingStore((state) => state.MAC);
  const span = useWingStore((state) => state.span);
  const shape = useWingStore((state) => state.shape);

  const x = useResultsChartStore((state) => state.x);
  const locked = useResultsChartStore((state) => state.locked);
  const hover = useResultsChartStore((state) => state.hover);

  usePlaneAerodynamics();

  const { pathname } = useLocation();

  const [planeSpring, api] = useSpring(
    () => ({
      wingY: configuration === 1 || configuration === 3 ? 1 : 0,
      cylinders:
        shape === 0 && (configuration === 1 || configuration === 3) ? 1 : 0,
      fuseZ:
        configuration === 2 || configuration === 3 ? fuselageDistance / 2 : 0,
      wingPosition: -wingX,
      planePosition: MAC / 2,
      scale: 1.5,
      tailPosition: verticalX,
      verticalY,
      planeRotation: 0,
      planeAoA: 0,
    }),
    [
      configuration,
      fuselage,
      fuselageDistance,
      shape,
      wingX,
      pathname,
      length,
      verticalX,
      verticalY,
    ]
  );

  useEffect(() => {
    api.start({
      planePosition:
        pathname === "/aerodynamics/fuselage" ||
        pathname === "/aerodynamics/results"
          ? MAC / 2
          : -7.5,
      scale: pathname === "/aerodynamics/fuselage" ? 1.5 : 3,
      planeRotation:
        pathname === "/aerodynamics/results" ||
        pathname === "/aerodynamics/glide"
          ? Math.PI / 1.15
          : 0,
      config: {
        duration: 1500,
        easing: easings.easeOutQuad,
      },
    });
  }, [pathname]);

  useEffect(() => {
    api.start({
      planeAoA:
        (pathname === "/aerodynamics/results" && !!locked) || hover
          ? (-x["Coefficient of Lift"] * Math.PI) / 180
          : 0,
    });
  }, [x, pathname, locked, hover]);

  return (
    <mesh position-x={-4.5}>
      <animated.mesh
        position-x={planeSpring.planePosition.to((x) => 0)}
        // scale={1.5}
      >
        <spotLight position={[-10, 5, 10]} intensity={0.5} />
        <PresentationControls
          enabled={true} // the controls can be disabled by setting this to false
          global={false} // Spin globally or by dragging the model
          cursor={true} // Whether to toggle cursor style on drag
          snap={true} // Snap-back to center (can also be a spring config)
          speed={1} // Speed factor
          zoom={1.25} // Zoom factor when half the polar-max is reached
          rotation={[0, 0, 0]} // Default rotation
          polar={[-Math.PI / 8, Math.PI / 16]} // Vertical limits
          azimuth={[-Math.PI / 2, Math.PI / 2]} // Horizontal limits
          config={{ mass: 1, tension: 170, friction: 26 }}
        >
          <animated.mesh
            scale={1.5}
            position-x={planeSpring.planePosition}
            rotation-y={planeSpring.planeRotation}
            rotation-z={planeSpring.planeAoA}
          >
            <animated.mesh position-z={planeSpring.fuseZ.to((z) => -z)}>
              <FuseModel opacity={opacity} />
            </animated.mesh>
            <animated.mesh position-z={planeSpring.fuseZ}>
              <FuseModel opacity={opacity} />
              <MeasurementsFuse opacity={opacity} />
              <animated.mesh position-x={planeSpring.tailPosition}>
                <animated.mesh position-y={planeSpring.verticalY}>
                  <StabilizerVertical opacity={opacity} />
                </animated.mesh>
              </animated.mesh>
            </animated.mesh>
            <StabilizerHorizontal opacity={opacity} />
            <WingModel opacity={opacity} />
            <animated.mesh position-y={planeSpring.wingY}>
              <WingModel opacity={opacity} />
            </animated.mesh>
            <animated.mesh scale={planeSpring.cylinders}>
              <Instances limit={4} position-y={1.25 / 2} position-x={0.1}>
                <cylinderGeometry args={[0.03, 0.03, 1, 32]} />
                <animated.meshStandardMaterial
                  color={"white"}
                  metalness={0.5}
                  transparent
                  opacity={opacity}
                />
                <Instance position={[0.2, 0, (-0.95 * span) / 2]} />
                <Instance position={[1.2, 0, (-0.95 * span) / 2]} />
                <Instance position={[0.2, 0, (0.95 * span) / 2]} />
                <Instance position={[1.2, 0, (0.95 * span) / 2]} />
              </Instances>
            </animated.mesh>
          </animated.mesh>
        </PresentationControls>
      </animated.mesh>
    </mesh>
  );
};

export default Fuselage;
