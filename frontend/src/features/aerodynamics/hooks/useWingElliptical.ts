import { useMemo } from "react";
import { getXTip } from "../three/hooks/useWingSprings";
import { useWingStore } from "../stores/useWing";
import { useProfileCamber } from "./useProfile";

const NUM_OF_SEGMENTS = 30;

const useWingElliptical = () => {
  const wing = useWingStore();
  const { F } = useProfileCamber();

  const leadingPoints = useMemo(() => {
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
    return points;
  }, [wing]);

  const trailingPoints = useMemo(() => {
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

    return points;
  }, [wing]);

  const surfacePoints = [
    ...leadingPoints.map(([x, y, z]) => [x, y]),
    ...trailingPoints.map(([x, y, z]) => [x, y]).reverse(),
  ];

  return { leadingPoints, trailingPoints, surfacePoints };
};

export default useWingElliptical;
