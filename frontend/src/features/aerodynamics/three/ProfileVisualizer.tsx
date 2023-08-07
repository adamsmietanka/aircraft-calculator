import Line from "../../power_unit/three/Line";
import { useThree } from "@react-three/fiber";
import { useCSSColors } from "../../power_unit/three/config";
import { animated, useSpring } from "@react-spring/three";
import useProfile from "../hooks/useProfile";
import { useProfileChartsStore } from "../hooks/useProfileCharts";

const ProfileVisualizer = () => {
  const x = useProfileChartsStore((state) => state.x);
  const hover = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);

  const { width } = useThree((state) => state.viewport);
  const scale = 0.99 * width;

  const { profilePoints, chordPoints } = useProfile();

  const [rotationSpring] = useSpring(
    () => ({
      x: locked || hover ? x : 0,
    }),
    [x, hover, locked]
  );

  const { primaryColor, secondaryColor } = useCSSColors();

  return (
    <animated.mesh
      position={[-0.25 * scale, 0, 0]}
      scale={scale}
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
  );
};

export default ProfileVisualizer;
