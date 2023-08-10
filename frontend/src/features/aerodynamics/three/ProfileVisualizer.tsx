import Line from "../../common/three/Line";
import { useThree } from "@react-three/fiber";
import { useCSSColors } from "../../common/three/config";
import { animated, useSpring } from "@react-spring/three";
import useProfile from "../hooks/useProfile";
import { useProfileChartsStore } from "../hooks/useProfileCharts";
import Vector from "./Vector";

const ProfileVisualizer = () => {
  const x = useProfileChartsStore((state) => state.x);
  const y = useProfileChartsStore((state) => state.y);
  const hover = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);

  const { width } = useThree((state) => state.viewport);
  const scale = 0.99 * width;

  const { profilePoints, chordPoints } = useProfile();

  const [rotationSpring] = useSpring(
    () => ({
      x:
        locked || hover["Coefficient of Lift"] || hover["Coefficient of Drag"]
          ? x["Coefficient of Lift"]
          : 0,
    }),
    [x, y, hover, locked]
  );

  const { primaryColor, secondaryColor, errorColor } = useCSSColors();

  return (
    <animated.mesh position={[-0.25 * scale, 0, 0]} scale={scale}>
      <Vector
        value={y["Coefficient of Lift"]}
        rotation={0}
        show={
          !!locked ||
          hover["Coefficient of Lift"] ||
          hover["Coefficient of Drag"]
        }
      />
      <Vector
        value={50 * x["Coefficient of Drag"]}
        rotation={-Math.PI / 2}
        show={
          !!locked ||
          hover["Coefficient of Lift"] ||
          hover["Coefficient of Drag"]
        }
        color={errorColor}
      />
      <animated.mesh
        rotation-z={rotationSpring.x.to((x) => (-x * Math.PI) / 180)}
      >
        <Line
          trace={{ name: "Outline", points: profilePoints }}
          scale={[1, 1, 1]}
          color={primaryColor}
        />
        <Line
          trace={{ name: "Chord", points: chordPoints }}
          scale={[1, 1, 1]}
          color={secondaryColor}
        />
      </animated.mesh>
    </animated.mesh>
  );
};

export default ProfileVisualizer;
