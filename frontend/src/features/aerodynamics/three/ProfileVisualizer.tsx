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

  const { profilePoints, yCamber } = useProfile();

  const show =
    !!locked || hover["Coefficient of Lift"] || hover["Coefficient of Drag"];

  const localWidth = CANVAS_WIDTH * size[0];

  const [profileSpring] = useSpring(
    () => ({
      aoa: show ? (-x["Coefficient of Lift"] * Math.PI) / 180 : 0,
      yCamber: -yCamber,
    }),
    [x, hover, locked, show, yCamber]
  );

  return (
    <animated.mesh position-x={(gridPositionX * size[0] * CANVAS_WIDTH) / 2}>
      <Vector
        tex="F_L"
        value={y["Coefficient of Lift"]}
        rotation={0}
        show={y["Coefficient of Lift"] !== 0 && show}
        color="primary"
      />
      <Vector
        tex="F_D"
        value={50 * x["Coefficient of Drag"]}
        otherValue={y["Coefficient of Lift"]}
        rotation={-Math.PI / 2}
        show={show}
        color="error"
      />
      <animated.mesh rotation-z={profileSpring.aoa} scale={0.96 * localWidth}>
        <animated.mesh position-x={-0.25} position-y={-yCamber}>
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
        </animated.mesh>
      </animated.mesh>
    </animated.mesh>
  );
};

export default ProfileVisualizer;
