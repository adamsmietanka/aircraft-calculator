import { useMemo } from "react";
import useProfile from "../../hooks/useProfile";
import { useWingStore } from "../../stores/useWing";
import { getXTip } from "./useWingSprings";
import { BufferAttribute, BufferGeometry } from "three";
import useWingOutline from "../../hooks/useWingOutline";

const PANELS = 101;

const useWingModel = () => {
  const wing = useWingStore();

  const { profilePoints } = useProfile();
  const { modelPoints } = useWingOutline();

  const xTip = getXTip(wing.angle, wing.span);

  const getOutline = () => {
    if (wing.shape === 0)
      return {
        xOutline: [
          [0, wing.chord],
          [0, wing.chord],
        ],
        yOutline: [0, wing.span / 2],
      };
    if (wing.shape === 1)
      return {
        xOutline: [
          [0, wing.chord],
          [xTip, xTip + wing.chordTip],
        ],
        yOutline: [0, wing.span / 2],
      };
    return modelPoints;
  };

  const geometry = useMemo(() => {
    const geom = new BufferGeometry();

    const { xOutline, yOutline } = getOutline();
    if (profilePoints.length) {
      let arr = [];

      for (let j = 0; j < yOutline.length - 1; j++) {
        const fuse = profilePoints.map(([x, y, z]) => [
          xOutline[j][0] + (xOutline[j][1] - xOutline[j][0]) * x,
          (xOutline[j][1] - xOutline[j][0]) * y,
          yOutline[j],
        ]);

        const tip = profilePoints.map(([x, y, z]) => [
          xOutline[j + 1][0] + (xOutline[j + 1][1] - xOutline[j + 1][0]) * x,
          (xOutline[j + 1][1] - xOutline[j + 1][0]) * y,
          yOutline[j + 1],
        ]);

        for (let i = 0; i < PANELS; i++) {
          arr.push(...fuse[i]);
          arr.push(...fuse[i + 1]);
          arr.push(...tip[i]);
          arr.push(...fuse[i + 1]);
          arr.push(...tip[i + 1]);
          arr.push(...tip[i]);
        }
      }
      const attr = new BufferAttribute(new Float32Array(arr), 3);
      geom.setAttribute("position", attr);
      geom.computeVertexNormals();
      return geom;
    }
  }, [profilePoints]);
  return { geometry };
};
export default useWingModel;
