import VectorNew from "../../common/three/VectorNew";
import { SpringValue, animated, useSpring } from "@react-spring/three";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import { useWingStore } from "../stores/useWing";
import { VECTOR_SIZE } from "../../common/three/config";

interface Props {
  show: boolean;
  opacity: SpringValue<number>;
}

const ProfileFlowSpeed = ({ show, opacity }: Props) => {
  const reynolds = useWingStore((state) => state.reynolds);

  const [spring, api] = useSpring(
    () => ({
      speed: reynolds,
    }),
    [reynolds]
  );

  const smolness = 5;

  return (
    <animated.mesh
      position-x={spring.speed.to((x) => -(1.5 + x / (2 * smolness)))}
    >
      <VectorNew
        x={reynolds / (smolness * VECTOR_SIZE)}
        show={show}
        opacity={opacity}
        color="primary"
      >
        <HoverableFormulaSimple
          className="mb-8 mr-12"
          name="Freeflow speed"
          tex="V"
        />
      </VectorNew>
    </animated.mesh>
  );
};

export default ProfileFlowSpeed;
