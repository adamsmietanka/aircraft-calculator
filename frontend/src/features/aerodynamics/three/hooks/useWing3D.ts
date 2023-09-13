import { useProfileCamber } from "./../../hooks/useProfile";
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

  const NUM_OF_SEGMENTS = 30;

  const { F } = useProfileCamber();

  const leadingEdge = useMemo(() => {
    const xTip = getXTip(wing.angle, wing.span);
    const z = -0.01;

    let points = [];
    if (wing.shape === 0) {
      for (let i = -NUM_OF_SEGMENTS / 2; i <= NUM_OF_SEGMENTS / 2; i++) {
        points.push([0, (i * wing.span) / NUM_OF_SEGMENTS, z]);
      }
    } else if (wing.shape === 1) {
      for (let i = -NUM_OF_SEGMENTS / 2; i <= NUM_OF_SEGMENTS / 2; i++) {
        const normY = (2 * Math.abs(i)) / NUM_OF_SEGMENTS;
        points.push([normY * xTip, (i * wing.span) / NUM_OF_SEGMENTS, z]);
      }
    } else {
      for (let i = -NUM_OF_SEGMENTS / 2; i <= NUM_OF_SEGMENTS / 2; i++) {
        points.push([
          wing.chord *
            F *
            (1 -
              Math.cos((((2 * Math.abs(i)) / NUM_OF_SEGMENTS) * Math.PI) / 2)),
          (wing.span / 2) *
            Math.sign(i) *
            Math.sin((((2 * Math.abs(i)) / NUM_OF_SEGMENTS) * Math.PI) / 2),
          z,
        ]);
      }
    }

    return {
      name: "",
      points,
    };
  }, [wing]);

  const trailingEdge = useMemo(() => {
    const xTip = getXTip(wing.angle, wing.span);
    const z = -0.01;

    let points = [];
    if (wing.shape === 0) {
      for (let i = -NUM_OF_SEGMENTS / 2; i <= NUM_OF_SEGMENTS / 2; i++) {
        points.push([wing.chord, (i * wing.span) / NUM_OF_SEGMENTS, z]);
      }
    } else if (wing.shape === 1) {
      for (let i = -NUM_OF_SEGMENTS / 2; i <= NUM_OF_SEGMENTS / 2; i++) {
        const normY = (2 * Math.abs(i)) / NUM_OF_SEGMENTS;
        points.push([
          normY * (xTip + wing.chordTip) + (1 - normY) * wing.chord,
          (i * wing.span) / NUM_OF_SEGMENTS,
          z,
        ]);
      }
    } else {
      for (let i = -NUM_OF_SEGMENTS / 2; i <= NUM_OF_SEGMENTS / 2; i++) {
        points.push([
          wing.chord *
            (F +
              (1 - F) *
                Math.cos(
                  (((2 * Math.abs(i)) / NUM_OF_SEGMENTS) * Math.PI) / 2
                )),
          (wing.span / 2) *
            Math.sign(i) *
            Math.sin((((2 * Math.abs(i)) / NUM_OF_SEGMENTS) * Math.PI) / 2),
          z,
        ]);
      }
    }

    return {
      name: "",
      points,
    };
  }, [wing]);

  return {
    onTransform,
    leadingEdge,
    trailingEdge,
    active,
    setActive,
    step: getStep(wing.span / 1.5),
  };
};

export default useWing3D;
