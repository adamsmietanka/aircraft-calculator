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
import { useWingStore } from "../../stores/useWing";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../../common/three/config";

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
    position: [-5, 2, 5],
    rotation: [-0.323, -0.759, -0.226],
  },
};

const getXTip = (angle: number, span: number) =>
  (Math.tan((angle * Math.PI) / 180) * span) / 2;

const useCamera = () => {
  const { camera, controls } = useThree();

  const location = useLocation();

  const chord = useWingStore((state) => state.chord);
  const chordTip = useWingStore((state) => state.chordTip);
  const angle = useWingStore((state) => state.angle);
  const span = useWingStore((state) => state.span);

  const size = [0.33, 1];
  const localWidth = CANVAS_WIDTH * size[0];
  const localHeight = CANVAS_HEIGHT * size[1];

  const [s, api] = useSpring(
    () => ({
      from: {
        position: camera.position.toArray(),
        rotation: [0, 0, 0],
        target: [0, 0, 0],
        scale: 1,
        profileX: 0,
        opacityProfile: 0,
        opacityWing: 0,
        opacityFuselage: 0,
      },
      to: async (next, cancel) => {
        await next({ opacityProfile: 0, opacityWing: 0, opacityFuselage: 0 });
        await next({
          position: obj[location.pathname].position,
          rotation: obj[location.pathname].rotation,
          profileX:
            location.pathname === "/aerodynamics/profile"
              ? -0.25 * 0.96 * localWidth
              : 0,
          scale:
            location.pathname === "/aerodynamics/profile"
              ? 0.96 * localWidth
              : Math.min(
                  localHeight / span,
                  (0.5 * localWidth) / (getXTip(angle, span) + chordTip),
                  (0.5 * localWidth) / chord
                ) * chord,
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
              tension: 400,
              friction: 170,
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

  useEffect(() => {
    api.start({
      scale:
        Math.min(
          localHeight / span,
          (0.5 * localWidth) / (getXTip(angle, span) + chordTip),
          (0.5 * localWidth) / chord
        ) * chord,
    });
  }, [span, angle, chord, chordTip]);

  useFrame(() => {
    if (s.position.animation.changed) {
      camera.position.set(...s.position.get());
      camera.rotation.set(...s.rotation.get());
    }
  });

  return { s };
};

export default useCamera;
