import { useMemo } from "react";
import useProfile from "../../hooks/useProfile";
import { useWingStore } from "../../stores/useWing";
import { getXTip } from "./useWingSpring";
import { BufferAttribute, BufferGeometry, Shape, ShapeGeometry } from "three";
import useWingOutline from "../../hooks/useWingOutline";
import { useLocation } from "react-router-dom";
import { NUMBER_OF_AIRFOIL_POINTS } from "../../../common/three/config";

const PANELS = 2 * NUMBER_OF_AIRFOIL_POINTS + 1;

const useWingModel = (customShape?: number) => {
  const wing = useWingStore();
  const location = useLocation();

  const { profilePoints } = useProfile();
  const { modelPoints } = useWingOutline();

  const xTip = getXTip(wing.angle, wing.span);
  const wingShape =
    !!customShape || customShape === 0 ? customShape : wing.shape;

  const getOutline = () => {
    if (wingShape === 0)
      return {
        xOutline: [
          [0, wing.chord],
          [0, wing.chord],
          [0, wing.chord],
        ],
        yOutline: [-wing.span / 2, 0, wing.span / 2],
      };
    if (wingShape === 1)
      return {
        xOutline: [
          [xTip, xTip + wing.chordTip],
          [0, wing.chord],
          [xTip, xTip + wing.chordTip],
        ],
        yOutline: [-wing.span / 2, 0, wing.span / 2],
      };
    return modelPoints;
  };

  const tipGeometry = useMemo(() => {
    const shape = new Shape();

    const { xOutline, yOutline } = getOutline();
    if (profilePoints.length) {
      const tip = profilePoints.map(([x, y, z]) => [
        xOutline[2][0] + (xOutline[2][1] - xOutline[2][0]) * x,
        (xOutline[2][1] - xOutline[2][0]) * y,
        yOutline[2],
      ]);
      shape.moveTo(tip[0][0], tip[0][1]);

      for (let i = 1; i < PANELS; i++) {
        shape.lineTo(tip[i][0], tip[i][1]);
      }
      const geometry = new ShapeGeometry(shape);
      geometry.translate(0, 0, tip[0][2]);
      return geometry;
    }
  }, [profilePoints, location.pathname]);

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
  }, [profilePoints, location.pathname]);
  return { geometry, tipGeometry };
};
export default useWingModel;
