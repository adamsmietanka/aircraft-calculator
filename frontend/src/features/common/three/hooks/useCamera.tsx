import {
  a,
  config,
  useChain,
  useSpring,
  useSpringRef,
} from "@react-spring/three";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

const obj: Record<string, Record<string, number[]>> = {
  "/aerodynamics/profile": {
    position: [0, 0, 30],
    rotation: [0, 0, 0],
  },
  "/aerodynamics/wing": {
    position: [0, 30, 0],
    rotation: [-Math.PI / 2, 0, 0],
  },
  "/aerodynamics/fuselage": {
    position: [-30, 10, 30],
    rotation: [-0.323, -0.759, -0.226],
  },
};

const useCamera = () => {
  const { camera, controls } = useThree();

  const location = useLocation();

  const [s] = useSpring(
    () => ({
      from: {
        position: camera.position.toArray(),
        rotation: [0, 0, 0],
        target: [0, 0, 0],
        opacityProfile: 0,
        opacityWing: 0,
        opacityFuselage: 0,
      },
      to: async (next, cancel) => {
        await next({ opacityProfile: 0, opacityWing: 0, opacityFuselage: 0 });
        await next({
          position: obj[location.pathname].position,
          rotation: obj[location.pathname].rotation,
        });
        await next({
          opacityProfile: location.pathname === "/aerodynamics/profile" ? 1 : 0,
          opacityWing: location.pathname === "/aerodynamics/wing" ? 1 : 0,
          opacityFuselage:
            location.pathname === "/aerodynamics/fuselage" ? 1 : 0,
        });
      },
      config: (key) => {
        switch (key) {
          case "position":
          case "rotation":
            return {
              mass: 20,
              tension: 500,
              friction: 170
            };
          default:
            return config.default;
        }
      },
      //   onStart: () => {
      //     if (!controls) return;
      //     controls.enabled = false;
      //   },
      //   onRest: () => {
      //     if (!controls) return;
      //     controls.enabled = true;
      //   },
    }),
    [location.pathname]
  );

  useFrame(() => {
    if (s.position.animation.changed) {
      camera.position.set(...s.position.get());
      camera.rotation.set(...s.rotation.get());
    }
  });

  return { s };
};

export default useCamera;
