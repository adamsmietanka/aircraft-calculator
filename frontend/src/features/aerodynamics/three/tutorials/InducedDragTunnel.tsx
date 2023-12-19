import { animated, to, useSpring } from "@react-spring/three";
import { useInducedDragStore } from "./stores/useInducedDrag";
import { Props } from "../../../common/types/three";
import { DoubleSide } from "three";

const InducedDragTunnel = ({ opacity }: Props) => {
  const show = useInducedDragStore((state) => state.tunnel);

  const [spring, api] = useSpring(
    () => ({
      from: { opacity: 0, visible: false },
      to: async (next) => {
        show && (await next({ visible: true }));
        await next({ opacity: show ? 1 : 0 });
        show || (await next({ visible: false }));
      },
    }),
    [show]
  );
  return (
    <animated.mesh
      position-x={0.4}
      rotation-z={Math.PI / 2}
      visible={spring.visible}
    >
      <cylinderGeometry args={[0.5, 0.5, 1.1, 32, 1, true]} />
      <animated.meshStandardMaterial
        color={"lightgray"}
        side={DoubleSide}
        metalness={1}
        transparent
        opacity={to(
          [opacity, spring.opacity],
          (o, tunnelOpacity) => o * tunnelOpacity
        )}
      />
    </animated.mesh>
  );
};

export default InducedDragTunnel;
