import { useSpring } from "@react-spring/three";
import { Object3D, Event } from "three";
import { useWingStore } from "../../stores/useWing";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../../common/three/config";

const getXTip = (angle: number, span: number) =>
  (Math.tan((angle * Math.PI) / 180) * span) / 2;

const useWingSprings = (active: Object3D<Event>, size: number[]) => {
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

  const localWidth = CANVAS_WIDTH * size[0];
  const localHeight = CANVAS_HEIGHT * size[1];

  const [wingSpring] = useSpring(
    () => ({
      scale: Math.min(
        localHeight / span,
        (0.5 * localWidth) / (getXTip(angle, span) + chordTip),
        (0.5 * localWidth) / (chord)
      ),
      rotationZ: ((90 - angle) * Math.PI) / 180,
      x: getXTip(angle, span),
      y: span / 2,
      chord,
      chordTip,
      angle,
    }),
    [span, angle, chord, chordTip, localHeight, localWidth]
  );
  return { gizmoSpring, wingSpring };
};
export default useWingSprings;
