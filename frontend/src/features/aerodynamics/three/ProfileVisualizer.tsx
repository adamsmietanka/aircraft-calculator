import Line from "../../common/three/Line";
import { useThree } from "@react-three/fiber";
import { CANVAS_WIDTH, useCSSColors } from "../../common/three/config";
import { animated, useSpring } from "@react-spring/three";
import useProfile from "../hooks/useProfile";
import { useProfileChartsStore } from "../hooks/useProfileCharts";
import Vector from "./Vector";
import AirStream from "./AirStream";

interface Props {
  size: number[];
  gridPositionX: number;
}

const ProfileVisualizer = ({ size, gridPositionX }: Props) => {
  const x = useProfileChartsStore((state) => state.x);
  const y = useProfileChartsStore((state) => state.y);
  const hover = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);

  const scale = 0.96 * CANVAS_WIDTH * size[0];

  const { profilePoints, chordPoints } = useProfile();

  const show =
    !!locked || hover["Coefficient of Lift"] || hover["Coefficient of Drag"];

  const [rotationSpring] = useSpring(
    () => ({
      x: show ? x["Coefficient of Lift"] : 0,
    }),
    [x, y, hover, locked]
  );

  const { primaryColor, secondaryColor, errorColor, gridColor } =
    useCSSColors();

  return (
    <animated.mesh position-x={(gridPositionX * size[0] * CANVAS_WIDTH) / 2}>
      <animated.mesh position={[-0.25 * scale, 0, 0]} scale={scale}>
        <Vector
          tex="\bf F_L"
          value={y["Coefficient of Lift"]}
          rotation={0}
          show={show}
          color="primary"
        />
        <Vector
          tex="\bf F_D"
          value={50 * x["Coefficient of Drag"]}
          rotation={-Math.PI / 2}
          show={show}
          color="error"
        />
        <animated.mesh
          rotation-z={rotationSpring.x.to((x) => (-x * Math.PI) / 180)}
        >
          <Line
            trace={{ name: "Outline", points: profilePoints }}
            scale={[1, 1, 1]}
            color={primaryColor}
          />
          <AirStream
            points={profilePoints.slice(0, 50)}
            show={show}
            positionY={0.03}
          />
          <AirStream
            points={profilePoints.slice(50, 100).reverse()}
            show={show}
            positionY={-0.03}
          />
          <Line
            trace={{ name: "Chord", points: chordPoints }}
            scale={[1, 1, 1]}
            width={0.5}
            color={secondaryColor}
          />
        </animated.mesh>
      </animated.mesh>
    </animated.mesh>
  );
};

export default ProfileVisualizer;
