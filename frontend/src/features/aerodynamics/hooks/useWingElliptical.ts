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
    for (let i = -NUM_OF_SEGMENTS / 2; i <= NUM_OF_SEGMENTS / 2; i++) {
      const norm = (2 * i) / NUM_OF_SEGMENTS;
      const j =
        Math.sign(norm) * (1 - (Math.abs(norm) - 1) * (Math.abs(norm) - 1));
      console.log(norm, j);
      if (wing.shape === 0) {
        points.push([0, (j * wing.span) / 2, z]);
      } else if (wing.shape === 1) {
        points.push([Math.abs(j) * xTip, (j * wing.span) / 2, z]);
      } else {
        points.push([
          wing.chord * F * (1 - Math.cos((Math.abs(j) * Math.PI) / 2)),
          (wing.span / 2) *
            Math.sign(j) *
            Math.sin((Math.abs(j) * Math.PI) / 2),
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
    for (let i = -NUM_OF_SEGMENTS / 2; i <= NUM_OF_SEGMENTS / 2; i++) {
      const norm = (2 * i) / NUM_OF_SEGMENTS;
      const j =
        Math.sign(norm) * (1 - (Math.abs(norm) - 1) * (Math.abs(norm) - 1));
      console.log(norm, j);
      if (wing.shape === 0) {
        points.push([wing.chord, (j * wing.span) / 2, z]);
      } else if (wing.shape === 1) {
        points.push([
          Math.abs(j) * (xTip + wing.chordTip) + (1 - Math.abs(j)) * wing.chord,
          (j * wing.span) / 2,
          z,
        ]);
      } else {
        points.push([
          wing.chord * (F + (1 - F) * Math.cos((Math.abs(j) * Math.PI) / 2)),
          (wing.span / 2) *
            Math.sign(j) *
            Math.sin((Math.abs(j) * Math.PI) / 2),
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

  const modelPoints = {
    xOutline: leadingPoints.map(([x], index) => [x, trailingPoints[index][0]]),
    yOutline: leadingPoints.map(([x, y, z]) => y),
  };

  return { leadingPoints, trailingPoints, surfacePoints, modelPoints };
};

export default useWingElliptical;
