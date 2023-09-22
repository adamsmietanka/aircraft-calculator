import { config, useSpring } from "@react-spring/three";
import { useFrame, useThree } from "@react-three/fiber";
import { useLocation } from "react-router-dom";
import { CAMERA_DELAY } from "./config";

const obj: Record<string, Record<string, number[]>> = {
  "/": {
    position: [0, 0, 70],
    rotation: [0, 0, 0],
  },
  "/aerodynamics/profile": {
    position: [0, 0, 20],
    rotation: [0, 0, 0],
  },
  "/aerodynamics/wing": {
    position: [0, 20, 0],
    rotation: [-Math.PI / 2, 0, 0],
  },
  "/aerodynamics/fuselage": {
    position: [-10, 4, 10],
    rotation: [-0.382, -0.748, -0.267],
  },
};

const Camera = () => {
  const { camera, controls } = useThree();

  const location = useLocation();

  const [s, api] = useSpring(
    () => ({
      from: {
        position: camera.position.toArray(),
        rotation: [0, 0, 0],
      },
      to: async (next, cancel) => {
        await next({
          position: obj[location.pathname].position,
          rotation: obj[location.pathname].rotation,
          delay: CAMERA_DELAY,
        });
      },
      config: (key) => {
        switch (key) {
          case "position":
          case "rotation":
            return {
              mass: 20,
              tension: 400,
              friction: 170,
            };
          default:
            return config.default;
        }
      },
    }),
    [location.pathname]
  );

  useFrame(() => {
    if (s.position.animation.changed) {
      camera.position.set(...s.position.get());
      camera.rotation.set(...s.rotation.get());
    }
  });

  return null;
};

export default Camera;
