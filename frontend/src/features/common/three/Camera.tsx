import { useSpring } from "@react-spring/three";
import { useFrame, useThree } from "@react-three/fiber";
import { useLocation } from "react-router-dom";
import { CAMERA_DELAY } from "./config";
import { useCameraStore } from "./stores/useCamera";
import { useEffect } from "react";

// spherical coords
const obj: Record<string, number[]> = {
  "/": [70, 90, 0],
  "/aerodynamics/introduction": [10, 90, 0],
  "/aerodynamics/profile": [20, 90, 0],
  "/aerodynamics/levelFlight": [10, 90, 0],
  "/aerodynamics/inducedDrag": [20, 90, 0],
  "/aerodynamics/wing": [20, 0, 0],
  "/aerodynamics/fuselage": [15, 70, -45],
};

const getCenter = (pathname: string) => {
  // cartesian coords
  const center: Record<string, number[]> = {
    "/aerodynamics/introduction": [-5, 0, 0],
    "/aerodynamics/inducedDrag": [-5, 0, 0],
  };
  return center[pathname] || [0, 0, 0];
};

const getPosition = ([r, theta, phi]: number[], [x, y, z]: number[]) => [
  r * Math.sin((theta * Math.PI) / 180) * Math.sin((phi * Math.PI) / 180) + x,
  r * Math.cos((theta * Math.PI) / 180) + y,
  r * Math.sin((theta * Math.PI) / 180) * Math.cos((phi * Math.PI) / 180) + z,
];

const getRotationPolar = ([r, theta, phi]: number[]) => [
  ((theta - 90) * Math.PI) / 180,
  (phi * Math.PI) / 180,
  0,
];
const Camera = () => {
  const { camera, controls } = useThree();

  const cameraState = useCameraStore();

  const { pathname } = useLocation();

  const [s, api] = useSpring(
    () => ({
      from: {
        position: camera.position.toArray(),
        rotation: [0, 0, 0],
      },
      to: {
        position: getPosition(obj[pathname], getCenter(pathname)),
        rotation: getRotationPolar(obj[pathname]),
        delay: CAMERA_DELAY,
      },
      config: {
        mass: 20,
        tension: 400,
        friction: 170,
      },
    }),
    [pathname]
  );

  useEffect(() => {
    cameraState.center &&
      api.start({
        position: getPosition(cameraState.spherical, cameraState.center),
        rotation: getRotationPolar(cameraState.spherical),
        delay: CAMERA_DELAY,
      });
  }, [cameraState]);

  useFrame(() => {
    const [x, y, z] = s.rotation.get();
    if (s.position.animation.changed) {
      camera.position.set(...s.position.get());
      camera.rotation.set(x, y, z, "YXZ");
    }
  });

  return null;
};

export default Camera;
