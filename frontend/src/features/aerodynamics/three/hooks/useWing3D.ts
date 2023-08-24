import { useMemo, useState } from "react";
import { useWingStore } from "../../stores/useWing";
import { getStep } from "../../../common/three/hooks/useAxes";

const getXTip = (angle: number, span: number) =>
  (Math.tan((angle * Math.PI) / 180) * span) / 2;

const useWing3D = () => {
  const wing = useWingStore();

  const [active, setActive] = useState<THREE.Object3D>(null!);

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
    const z = -0.1
    return {
      name: "",
      points: [
        [0, 0, z],
        [xTip, wing.span / 2, z],
        [xTip + wing.chordTip, wing.span / 2, z],
        [wing.chord, 0, z],
        [xTip + wing.chordTip, -wing.span / 2, z],
        [xTip, -wing.span / 2, z],
        [0, 0, z],
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
