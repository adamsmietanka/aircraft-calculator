import Line from "../../common/three/Line";
import { CANVAS_WIDTH } from "../../common/three/config";
import { SpringValue, animated, useSpring } from "@react-spring/three";
import useProfile from "../hooks/useProfile";
import { useProfileChartsStore } from "../hooks/useProfileCharts";
import Vector from "./Vector";
import AirStream from "./AirStream";

interface Props {
  size: number[];
  gridPositionX: number;
  opacity: SpringValue<number>;
}

const ProfileVisualizer = ({ size, gridPositionX, opacity }: Props) => {
  const x = useProfileChartsStore((state) => state.x);
  const y = useProfileChartsStore((state) => state.y);
  const hover = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);

  const { profilePoints, chordPoints } = useProfile();

  const show =
    !!locked || hover["Coefficient of Lift"] || hover["Coefficient of Drag"];

  const localWidth = CANVAS_WIDTH * size[0];

  const [rotationSpring] = useSpring(
    () => ({
      x: show ? x["Coefficient of Lift"] : 0,
    }),
    [x, y, hover, locked, show]
  );

  return (
    <animated.mesh position-x={(gridPositionX * size[0] * CANVAS_WIDTH) / 2}>
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
        <mesh position-x={-0.25 * 0.96 * localWidth} scale={0.96 * localWidth}>
          <AirStream
            points={profilePoints.slice(2, 50)}
            show={show}
            positionY={0.03}
          />
          <AirStream
            points={profilePoints.slice(50, 99).reverse()}
            show={show}
            positionY={-0.03}
          />
          <Line
            trace={{ name: "Chord", points: chordPoints }}
            scale={[1, 1, 1]}
            width={0.5}
            color="secondary"
          />
        </mesh>
      </animated.mesh>
    </animated.mesh>
  );
};

export default ProfileVisualizer;
