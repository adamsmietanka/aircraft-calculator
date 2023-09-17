import { Interpolation, animated } from "@react-spring/three";
import { Html } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

type Props = {
  position?: Interpolation<number[]>;
  "position-x"?: Interpolation<number>;
  "position-y"?: Interpolation<number>;
  "rotation-z"?: Interpolation<number>;
  scale: Interpolation<number>;
  children: React.ReactNode;
};

const checkVisible = (
  mesh: THREE.Mesh | THREE.Object3D<THREE.Event>
): boolean => {
  if (!mesh.visible) return false;
  if (mesh.parent) {
    return checkVisible(mesh.parent);
  }
  return true;
};

const AnimatedHtml = ({ children, ...rest }: Props) => {
  const htmlRef = useRef(null);
  const location = useLocation();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (htmlRef.current) {
      setVisible(checkVisible(htmlRef.current));
    }
  }, [location.pathname]);

  return (
    <animated.mesh {...rest} ref={htmlRef}>
      <Html className={`select-none ${!visible && "hidden"}`} transform prepend>
        <div>{children}</div>
      </Html>
    </animated.mesh>
  );
};

export default AnimatedHtml;
