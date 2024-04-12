import { animated, to, useSpring } from "@react-spring/three";
import { useInducedDragStore } from "./stores/useInducedDrag";
import { Props } from "../../../common/types/three";
import { DoubleSide } from "three";
import { useEffect, useMemo } from "react";
import { Wing } from "../../utils/wing/Wing";

const InducedDragWing = ({ opacity }: Props) => {
  const show = useInducedDragStore((state) => state.wing);
  const wingspan = useInducedDragStore((state) => state.wingspan);

  const wing = useMemo(() => {
    const wing = new Wing({ span: 2 }, "2412");
    wing.createModel(false);
    return wing;
  }, []);

  const [spring, api] = useSpring(
    () => ({
      from: { opacity: 0, visible: false, wingspan: 1 },
      to: async (next) => {
        show && (await next({ visible: true }));
        await next({ opacity: show ? 1 : 0 });
        show || (await next({ visible: false }));
      },
    }),
    [show]
  );

  useEffect(() => {
    api.start({ wingspan });
  }, [wingspan]);
  return (
    <animated.mesh visible={spring.visible} scale-z={spring.wingspan}>
      <mesh geometry={wing.geometry}>
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
