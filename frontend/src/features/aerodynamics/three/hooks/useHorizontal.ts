import { useEffect, useState } from "react";
import { useHorizontalStore } from "../../stores/useHorizontal";
import getLeadingTrailing from "../../utils/getLeadingTrailing";
import { BufferGeometry, SphereGeometry } from "three";
import getProfilePoints from "../../utils/getProfilePoints";
import createWingModel from "../utils/createWingModel";
import { useVerticalStore } from "../../stores/useVertical";

const useHorizontal = () => {
  const chordV = useVerticalStore((state) => state.chord);
  const chord = useHorizontalStore((state) => state.chord);
  const span = useHorizontalStore((state) => state.span);
  const angle = useHorizontalStore((state) => state.angle);
  const chordTip = useHorizontalStore((state) => state.chordTip);
  const shape = useHorizontalStore((state) => state.shape);
  const set = useHorizontalStore((state) => state.set);

  const [horizontal, setHorizontal] = useState<BufferGeometry>(
    new SphereGeometry()
  );

  const [leading, setLeading] = useState([
    [0, 0, 0],
    [1, 1, 1],
  ]);
  const [trailing, setTrailing] = useState([
    [0, 0, 0],
    [1, 1, 1],
  ]);
  const [top, setTop] = useState([
    [0, 0, 0],
    [1, 1, 1],
  ]);

  useEffect(() => {
    set({ chord: chordV });
    const { leadingPoints, trailingPoints } = getLeadingTrailing({
      span,
      chord,
      chordTip,
      angle,
      shape,
    });
    setLeading(leadingPoints);
    setTrailing(trailingPoints);
    setTop([
      leadingPoints[leadingPoints.length - 1],
      trailingPoints[trailingPoints.length - 1],
    ]);

    const symmetric = getProfilePoints("0009");
    setHorizontal(
      createWingModel(
        {
          span,
          chord,
          chordTip,
          angle,
          shape,
        },
        symmetric
      )
    );

    const getArea = () => {
      if (shape === 0) return chord * span;
      if (shape === 1) return ((chord + chordTip) * span) / 2;
      return (Math.PI * chord * span) / 4;
    };

    set({ area: getArea() });
  }, [span, chord, chordTip, angle, shape, chordV]);

  return { horizontal, leading, trailing, top };
};

export default useHorizontal;
