import { useEffect, useMemo, useState } from "react";
import { WingState, useWingStore } from "../../stores/useWing";
import { Mesh } from "three";
import { getStep } from "../../../common/three/hooks/useAxes";

const getXTip = (angle: number, span: number) =>
  (Math.tan((angle * Math.PI) / 180) * span) / 2;

const useWing3D = (
  leadingTip: React.RefObject<Mesh>,
  trailingTip: React.RefObject<Mesh>,
  trailingFuselage: React.RefObject<Mesh>
) => {
  const wing = useWingStore();

  const [active, setActive] = useState<THREE.Object3D>(null!);

  const updateWing = ({ chord, chordTip, span, angle }: WingState) => {
    if (leadingTip.current && trailingTip.current && trailingFuselage.current) {
      const xTip = getXTip(angle, span);

      leadingTip.current.position.setY(span / 2);
      leadingTip.current.position.setX(xTip);

      trailingTip.current.position.setY(span / 2);
      trailingTip.current.position.setX(xTip + chordTip);

      trailingFuselage.current.position.setX(chord);
      trailingFuselage.current.position.setY(0);
    }
  };

  useEffect(() => {
    useWingStore.subscribe(updateWing);

    const state = useWingStore.getState();
    updateWing(state);
  }, []);

  const onTransform = (e: THREE.Event | undefined) => {
    if (e && e.target.object) {
      const { isTip, isTrailing, isFuselage } = e.target.object.userData;
      const { x, y } = e.target.object.position;

      if (isTip) {
        useWingStore.setState({ span: y * 2 });

        if (isTrailing) {
          const angle = useWingStore.getState().angle;
          const span = useWingStore.getState().span;
          const xTip = getXTip(angle, span);

          useWingStore.setState({ chordTip: x - xTip });
        }
      } else if (isFuselage) {
        useWingStore.setState({ chord: x });
      }
    }
  };

  const trace = useMemo(() => {
    const xTip = getXTip(wing.angle, wing.span);
    return {
      name: "",
      points: [
        [0, 0, 0],
        [xTip, wing.span / 2, 0],
        [xTip + wing.chordTip, wing.span / 2, 0],
        [wing.chord, 0, 0],
        [xTip + wing.chordTip, -wing.span / 2, 0],
        [xTip, -wing.span / 2, 0],
        [0, 0, 0],
      ],
    };
  }, [wing]);

  return {
    onTransform,
    trace,
    active,
    setActive,
    step: getStep(wing.span / 1.5),
  };
};

export default useWing3D;
