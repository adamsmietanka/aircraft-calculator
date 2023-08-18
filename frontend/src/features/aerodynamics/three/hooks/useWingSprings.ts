import { useSpring } from "@react-spring/three";
import { useThree } from "@react-three/fiber";
import { Object3D, Event } from "three";
import { useWingStore } from "../../stores/useWing";

const getXTip = (angle: number, span: number) =>
  (Math.tan((angle * Math.PI) / 180) * span) / 2;

const useWingSprings = (active: Object3D<Event>) => {
  const chord = useWingStore((state) => state.chord);
  const chordTip = useWingStore((state) => state.chordTip);
  const angle = useWingStore((state) => state.angle);
  const span = useWingStore((state) => state.span);

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
        (0.8 * height) / span,
        (0.5 * width) / (getXTip(angle, span) + chordTip + 0.5),
        (0.5 * width) / (chord + 0.5)
      ),
      rotationZ: ((90 - angle) * Math.PI) / 180,
      x: getXTip(angle, span),
      y: span / 2,
      chord,
      chordTip,
    }),
    [span, angle, chord, chordTip, height]
  );
  return { gizmoSpring, wingSpring };
};
export default useWingSprings;
