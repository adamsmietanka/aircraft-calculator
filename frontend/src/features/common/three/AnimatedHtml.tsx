import { Interpolation, animated } from "@react-spring/three";
import { useSpring, animated as animatedWeb } from "@react-spring/web";
import { Html } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { checkVisible } from "./checkVisible";

type Props = {
  position?: Interpolation<number[]>;
  "position-x"?: Interpolation<number> | number;
  "position-y"?: Interpolation<number> | number;
  "rotation-z"?: Interpolation<number> | number;
  scale?: Interpolation<number>;
  show?: boolean;
  children: React.ReactNode;
};

const AnimatedHtml = ({ children, show = true, ...rest }: Props) => {
  const htmlRef = useRef(null);
  const location = useLocation();
  const Anim = animatedWeb(Html);

  const [visible, setVisible] = useState(false);

  const [props] = useSpring(
    () => ({
      opacity: visible && show ? 1 : 0,
    }),
    [show, visible]
  );

  useEffect(() => {
    if (htmlRef.current) {
      setVisible(checkVisible(htmlRef.current));
    }
  }, [location.pathname]);

  return (
    <animated.mesh {...rest} ref={htmlRef}>
      <Anim
        className={`select-none `}
        style={props}
        transform
        prepend
      >
        <div>{children}</div>
      </Anim>
    </animated.mesh>
  );
};

export default AnimatedHtml;
