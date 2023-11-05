import { PresentationControls } from "@react-three/drei";
import { SpringValue, animated, useSpring } from "@react-spring/three";
import Inputs3D from "../../common/three/Inputs3D";
import FuselageConfiguration from "../FuselageConfiguration";
import { usePlaneStore } from "../stores/usePlane";
import { useWingStore } from "../stores/useWing";
import WingModel from "./WingModel";
import FuseModel from "./FuseModel";
import LineChart from "../../common/three/LineChart";
import usePlaneAerodynamics from "../hooks/usePlaneAerodynamics";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import Legend from "../../common/three/Legend";

interface Props {
  opacity: SpringValue<number>;
}

const Fuselage = ({ opacity }: Props) => {
  const configuration = usePlaneStore((state) => state.configuration);
  const span = useWingStore((state) => state.span);

  const { wingCd, fuseCd, cl, cd } = usePlaneAerodynamics();

  const [planeSpring] = useSpring(
    () => ({
      wingY: configuration === 1 || configuration === 3 ? 1 : 0,
      fuseZ: configuration === 2 || configuration === 3 ? span / 6 : 0,
    }),
    [configuration]
  );

  return (
    <mesh position-x={0}>
      <mesh rotation={[(-20 * Math.PI) / 180, (-45 * Math.PI) / 180, 0, "YXZ"]}>
        <Inputs3D gridPositionX={-1}>
          <FuselageConfiguration />
        </Inputs3D>
        <LineChart
          width={0.5}
          gridPositionX={1}
          opacity={opacity}
          name="Coefficient of Drag"
          traces={[
            { name: "Plane", points: cd },
            { name: "Fuselage", points: fuseCd, style: "dotted" },
            { name: "Wing", points: wingCd, style: "thinDashed" },
          ]}
          axes={{
            x: {
              symbol: (
                <HoverableFormulaSimple
                  className="text-lg"
                  name="Coefficient of Drag"
                  tex="C_D"
                />
              ),
              name: "Coefficient of Drag (Cd)",
              min: 0,
            },
            y: {
              symbol: (
                <HoverableFormulaSimple
                  className="text-lg"
                  name="Coefficient of Lift"
                  tex="C_L"
                />
              ),
              name: "Cl",
              min: -1.75,
              max: 1.75,
            },
          }}
          yHover
          // store={useWingChartsStore}
        />
        <Legend
          gridPositionX={1.6}
          items={[
            { name: "Plane" },
            { name: "Fuselage", style: "dotted" },
            { name: "Wing", style: "thinDashed" },
          ]}
          opacity={opacity}
        />
      </mesh>
      <mesh position-x={-4.5}>
        <spotLight position={[-10, 5, 10]} intensity={0.5} />
        <PresentationControls
          enabled={true} // the controls can be disabled by setting this to false
          global={false} // Spin globally or by dragging the model
          cursor={true} // Whether to toggle cursor style on drag
          snap={true} // Snap-back to center (can also be a spring config)
          speed={1} // Speed factor
          zoom={2} // Zoom factor when half the polar-max is reached
          rotation={[0, 0, 0]} // Default rotation
          polar={[-Math.PI / 8, Math.PI / 16]} // Vertical limits
          azimuth={[-Math.PI / 2, Math.PI / 2]} // Horizontal limits
          config={{ mass: 1, tension: 170, friction: 26 }}
        >
          <mesh scale={1.25}>
            <animated.mesh position-z={planeSpring.fuseZ.to((z) => -z)}>
              <FuseModel opacity={opacity} />
            </animated.mesh>
            <animated.mesh position-z={planeSpring.fuseZ}>
              <FuseModel opacity={opacity} />
            </animated.mesh>
            <WingModel opacity={opacity} />
            <animated.mesh position-y={planeSpring.wingY}>
              <WingModel opacity={opacity} />
            </animated.mesh>
          </mesh>
        </PresentationControls>
      </mesh>
    </mesh>
  );
};

export default Fuselage;
