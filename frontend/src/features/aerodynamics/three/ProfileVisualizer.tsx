import { CANVAS_WIDTH } from "../../common/three/config";
import { SpringValue, animated } from "@react-spring/three";
import { useProfileChartsStore } from "../hooks/useProfileCharts";
import Vector from "./Vector";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import ProfileNACAExplanation from "./ProfileNACAExplanation";
import useWingScale from "../hooks/useWingScale";
import useProfileSpring from "./hooks/useProfileSpring";
import ProfileAirstreams from "./ProfileAirstreams";

interface Props {
  width: number;
  gridPositionX: number;
  opacity: SpringValue<number>;
}

const ProfileVisualizer = ({ width, gridPositionX, opacity }: Props) => {
  const x = useProfileChartsStore((state) => state.x);
  const y = useProfileChartsStore((state) => state.y);
  const hover = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);

  const show =
    !!locked || hover["Coefficient of Lift"] || hover["Coefficient of Drag"];

  const { scaleProfile } = useWingScale(width);

  const { profileSpring } = useProfileSpring(width);

  return (
    <animated.mesh position-x={(gridPositionX * CANVAS_WIDTH) / 2}>
      <Vector
        value={y["Coefficient of Lift"]}
        rotation={0}
        show={y["Coefficient of Lift"] !== 0 && show}
        opacity={opacity}
        color="primary"
      >
        <HoverableFormulaSimple
          name="Lift"
          tex={`F_L`}
          texHover={`F_L=\\frac{1}{2} \\rho V^2 S C_L`}
        />
      </Vector>
      <Vector
        value={50 * x["Coefficient of Drag"]}
        otherValue={y["Coefficient of Lift"]}
        rotation={-Math.PI / 2}
        show={show}
        opacity={opacity}
        color="error"
      >
        <HoverableFormulaSimple
          name="Drag"
          tex={`F_D`}
          texHover={` F_D=\\frac{1}{2} \\rho V^2 SC_D`}
        />
      </Vector>
      <animated.mesh rotation-z={profileSpring.angle} scale={scaleProfile}>
        <ProfileNACAExplanation scale={scaleProfile} />
        <ProfileAirstreams opacity={opacity} show={show} />
      </animated.mesh>
    </animated.mesh>
  );
};

export default ProfileVisualizer;
