import { animated, to, useSpring } from "@react-spring/three";
import { useInducedDragStore } from "./stores/useInducedDrag";
import { Props } from "../../../common/types/three";
import { DoubleSide } from "three";
import useSimpleWingModel from "../hooks/useSimpleWingModel";
import { useEffect } from "react";

const InducedDragWing = ({ opacity }: Props) => {
  const show = useInducedDragStore((state) => state.wing);
  const span = useInducedDragStore((state) => state.span);

  const { geom } = useSimpleWingModel();

  const [spring, api] = useSpring(
    () => ({
      from: { opacity: 0, visible: false, span: 1 },
      to: async (next) => {
        show && (await next({ visible: true }));
        await next({ opacity: show ? 1 : 0 });
        show || (await next({ visible: false }));
      },
    }),
    [show]
  );

  useEffect(() => {
    api.start({ span });
  }, [span]);
  return (
    <animated.mesh
      visible={spring.visible}
      scale-z={spring.span}
    >
      <mesh geometry={geom}>
        <animated.meshStandardMaterial
          color={"lightgray"}
          side={DoubleSide}
          metalness={1}
          transparent
          opacity={to([opacity, spring.opacity], (o, opacity) => o * opacity)}
        />
      </mesh>
    </animated.mesh>
  );
};

export default InducedDragWing;
