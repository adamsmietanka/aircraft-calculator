import React, { useEffect } from "react";
import { Props } from "../../../common/types/three";
import { animated, to, useSpring } from "@react-spring/three";
import { useHoverProfileStore } from "../../stores/useHoverProfile";

const ProfileAxis = ({ opacity }: Props) => {
  const show = useHoverProfileStore((state) => state.axis);
  const center = useHoverProfileStore((state) => state.axisCenter);

  const [spring, api] = useSpring(
    () => ({
      from: { opacity: 0, visible: false, positionX: 0, positionZ: 0 },
      to: async (next) => {
        show && (await next({ visible: true }));
        await next({ opacity: show ? 1 : 0 });
        show || (await next({ visible: false }));
      },
    }),
    [show]
  );

  useEffect(() => {
    api.start({ positionX: center ? 0.25 : 0, positionZ: show ? 0 : -1 });
  }, [center, show]);

  return (
    <animated.mesh
      position-x={spring.positionX}
      position-z={spring.positionZ}
      rotation-x={Math.PI / 2}
    >
      <cylinderGeometry args={[8e-3, 8e-3, 0.2, 32, 1]} />
      <animated.meshStandardMaterial
        visible={spring.visible}
        opacity={to([opacity, spring.opacity], (o, opacity) => o * opacity)}
        transparent
        color={"white"}
      />
    </animated.mesh>
  );
};

export default ProfileAxis;
