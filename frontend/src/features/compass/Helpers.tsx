import { SpringValue, animated, useSpring } from "@react-spring/three";
import React from "react";
import AnimatedLine from "../common/three/AnimatedLine";
import AnimatedHtml from "../common/three/AnimatedHtml";
import Formula from "../common/Formula";

interface Props {
  show: boolean;
  phi1: number;
  phi2: number;
  opacity: SpringValue<number>;
}

const Helpers = ({ show, phi1, phi2, opacity }: Props) => {
  const [spring] = useSpring(
    () => ({
      phi1,
      phi2,
    }),
    [phi1, phi2]
  );
  return (
    <mesh visible={show}>
      <animated.mesh rotation-z={spring.phi1}>
        <AnimatedLine
          points={[
            [-1.5, 0, 0],
            [2, 0, 0],
          ]}
          style="thin"
          color="grid"
          opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
        />
        <AnimatedHtml
          position-x={2.2}
          rotation-z={spring.phi1.to((p) => -p)}
          show={show}
        >
          <Formula tex="\phi_1" />
        </AnimatedHtml>
      </animated.mesh>
      <animated.mesh rotation-z={spring.phi2}>
        <AnimatedLine
          points={[
            [-1.5, 0, 0],
            [2, 0, 0],
          ]}
          style="thin"
          color="grid"
          opacity={opacity.to((o) => (true ? o * 0.33 : 0))}
        />
        <AnimatedHtml
          position-x={2.2}
          rotation-z={spring.phi2.to((p) => -p)}
          show={show}
        >
          <Formula tex="\phi_2" />
        </AnimatedHtml>
      </animated.mesh>
    </mesh>
  );
};

export default Helpers;
