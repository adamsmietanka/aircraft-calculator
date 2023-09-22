import { Interpolation, SpringValue, animated } from "@react-spring/three";
import { useSpring, animated as animatedWeb } from "@react-spring/web";
import { Html } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { checkVisible } from "./checkVisible";
import { ROUTE_DELAY } from "./config";

type Props = {
  position?: Interpolation<number[]>;
  "position-x"?: Interpolation<number> | number;
  "position-y"?: Interpolation<number> | SpringValue<number> | number;
  "rotation-z"?: Interpolation<number> | number;
  scale?: Interpolation<number>;
  show?: boolean;
  children: React.ReactNode;
};

const AnimatedHtml = ({ children, show = true, ...rest }: Props) => {
  const htmlRef = useRef(null);
  const location = useLocation();
  const Anim = animatedWeb(Html);

  const [props, propsApi] = useSpring(
    () => ({
      from: { opacity: 0, display: "none" },
      to: async (next) => {
        const vis = htmlRef.current && checkVisible(htmlRef.current);
        vis && show && (await next({ display: "block", delay: ROUTE_DELAY }));
        await next({ opacity: vis && show ? 1 : 0 });
        (vis && show) || (await next({ display: "none" }));
      },
    }),
    [location.pathname]
  );

  useEffect(() => {
    propsApi.start({
      to: async (next) => {
        const vis = htmlRef.current && checkVisible(htmlRef.current);
        vis && show && (await next({ display: "block" }));
        await next({ opacity: vis && show ? 1 : 0 });
        (vis && show) || (await next({ display: "none" }));
      },
    });
  }, [show]);

  return (
    <animated.mesh {...rest} ref={htmlRef}>
      <Anim className={`select-none `} style={props} transform>
        <div>{children}</div>
      </Anim>
    </animated.mesh>
  );
};

export default AnimatedHtml;
