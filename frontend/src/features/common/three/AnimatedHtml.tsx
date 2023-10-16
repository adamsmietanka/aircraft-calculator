import { Interpolation, SpringValue, animated } from "@react-spring/three";
import { useSpring, animated as animatedWeb } from "@react-spring/web";
import { Html } from "@react-three/drei";
import React, { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { checkVisible } from "./checkVisible";
import { ROUTE_DELAY } from "./config";
import { Mesh, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

type Props = {
  position?: Interpolation<number[]>;
  "position-x"?: Interpolation<number> | number;
  "position-y"?: Interpolation<number> | SpringValue<number> | number;
  "rotation-z"?: Interpolation<number> | SpringValue<number> | number;
  scale?: Interpolation<number> | number;
  show?: boolean;
  delayVisible?: number;
  children: React.ReactNode;
};

const AnimatedHtml = ({
  children,
  show = true,
  delayVisible = 0,
  ...rest
}: Props) => {
  const htmlRef = useRef<Mesh>(null!);
  const childRef = useRef<Mesh>(null!);

  const {pathname} = useLocation();
  const Anim = animatedWeb(Html);

  const worldScale = useMemo(() => new Vector3(1, 1, 1), []);

  const [props, propsApi] = useSpring(
    () => ({
      from: { opacity: 0, display: "none" },
      to: async (next) => {
        const vis = htmlRef.current && checkVisible(htmlRef.current);
        vis && show && (await next({ display: "block", delay: ROUTE_DELAY + delayVisible }));
        await next({ opacity: vis && show ? 1 : 0 });
        (vis && show) || (await next({ display: "none" }));
      },
    }),
    [pathname]
  );

  useFrame(() => {
    worldScale.setFromMatrixScale(htmlRef.current.matrixWorld);
    childRef.current.scale.set(
      1 / worldScale.getComponent(0),
      1 / worldScale.getComponent(1),
      1 / worldScale.getComponent(2)
    );
  });

  useEffect(() => {
    propsApi.start({
      to: async (next) => {
        const vis = htmlRef.current && checkVisible(htmlRef.current);
        vis && show && (await next({ display: "block", delay: delayVisible }));
        await next({ opacity: vis && show ? 1 : 0 });
        (vis && show) || (await next({ display: "none" }));
      },
    });
  }, [show]);

  return (
    <animated.mesh {...rest} ref={htmlRef}>
      <mesh ref={childRef}>
        <Anim className={`select-none `} style={props} transform>
          <div>{children}</div>
        </Anim>
      </mesh>
    </animated.mesh>
  );
};

export default AnimatedHtml;
