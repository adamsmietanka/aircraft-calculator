import { useSpring } from "@react-spring/three";
import { useThree } from "@react-three/fiber";
import { Object3D, Event } from "three";
import { useWingStore } from "../../stores/useWing";

const getXTip = (angle: number, span: number) =>
  (Math.tan((angle * Math.PI) / 180) * span) / 2;

const useWingSprings = (active: Object3D<Event>) => {
  const wing = useWingStore();

  const [gizmoSpring] = useSpring(
    () => ({
      size: !!active ? 0.6 : 0,
    }),
    [active]
  );
  const { height, width } = useThree((state) => state.viewport);

  const [wingSpring] = useSpring(
    () => ({
      scale: Math.min(
        (0.8 * height) / wing.span,
        (0.5 * width) / (getXTip(wing.angle, wing.span) + wing.chordTip + 0.5),
        (0.5 * width) / (wing.chord + 0.5)
      ),
      rotationZ: ((90 - wing.angle) * Math.PI) / 180,
      x: getXTip(wing.angle, wing.span),
      y: wing.span / 2,
    }),
    [wing.span, wing.angle, wing.chord, wing.chordTip, height]
  );
  return { gizmoSpring, wingSpring };
};
export default useWingSprings;
