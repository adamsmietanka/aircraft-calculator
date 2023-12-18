import { SpringValue, animated, useSpring } from "@react-spring/three";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { ROUTE_DELAY } from "../common/three/config";

export interface ElementProps {
  opacity: SpringValue<number>;
  visible: boolean;
}

interface Props {
  path?: string;
  paths?: string[];
  Element: ({ opacity }: ElementProps) => JSX.Element;
}

const Route = ({ path, paths, Element }: Props) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { pathname } = useLocation();
  const pathsArray = paths ? paths : [path];

  const isVisible = pathsArray.some((p) => pathname === p);

  const [props, propsApi] = useSpring(
    () => ({
      from: { opacity: 0, visible: false },
      to: async (next) => {
        isVisible && (await next({ visible: true, delay: ROUTE_DELAY }));
        await next({ opacity: isVisible ? 1 : 0 });
        isVisible || (await next({ visible: false }));
      },
    }),
    [isVisible]
  );

  return (
    <animated.mesh
      visible={props.visible}
      ref={meshRef}
      userData={{ hide: !isVisible, pathsArray }}
    >
      <Element opacity={props.opacity} visible={isVisible} />
    </animated.mesh>
  );
};

export default Route;
