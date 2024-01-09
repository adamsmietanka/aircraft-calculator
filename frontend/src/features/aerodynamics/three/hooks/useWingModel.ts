import { useEffect, useMemo, useState } from "react";
import { useWingStore } from "../../stores/useWing";
import { getXTip } from "./useWingSpring";
import { BufferAttribute, BufferGeometry, Shape, ShapeGeometry } from "three";
import useWingOutline from "../../hooks/useWingOutline";
import { NUMBER_OF_AIRFOIL_SEGMENTS } from "../../../common/three/config";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import { useProfileStore } from "../../stores/useProfile";
import { useLocation } from "react-router-dom";

const PANELS = 2 * NUMBER_OF_AIRFOIL_SEGMENTS + 1;

const useWingModel = (customShape?: number) => {
  const wing = useWingStore();
  const { pathname } = useLocation();

  const profilePoints = useProfileStore((state) => state.profile);
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

  const wingGeometry = useMemo(() => new BufferGeometry(), []);

  const [geom, setGeom] = useState<BufferGeometry>(new BufferGeometry());
  const { xOutline, yOutline } = getOutline();
  const shape = new Shape();

  const createModel = () => {
    let arr = [];
    let merged;

    for (let j = 1; j < yOutline.length; j++) {
      const fuse = profilePoints.map(([x, y, z]) => [
        xOutline[j - 1][0] + (xOutline[j - 1][1] - xOutline[j - 1][0]) * x,
        (xOutline[j - 1][1] - xOutline[j - 1][0]) * y,
        yOutline[j - 1],
      ]);

      const tip = profilePoints.map(([x, y, z]) => [
        xOutline[j][0] + (xOutline[j][1] - xOutline[j][0]) * x,
        (xOutline[j][1] - xOutline[j][0]) * y,
        yOutline[j],
      ]);

      for (let i = 0; i < PANELS; i++) {
        arr.push(...fuse[PANELS - i]);
        arr.push(...fuse[PANELS - i - 1]);
        arr.push(...tip[PANELS - i]);
        arr.push(...fuse[PANELS - i - 1]);
        arr.push(...tip[PANELS - i - 1]);
        arr.push(...tip[PANELS - i]);
      }
      if (j === yOutline.length - 1) {
        shape.moveTo(tip[0][0], tip[0][1]);

        for (let i = 1; i < PANELS; i++) {
          shape.lineTo(tip[i][0], tip[i][1]);
        }
      }
    }
    const attr = new BufferAttribute(new Float32Array(arr), 3);
    wingGeometry.setAttribute("position", attr);
    wingGeometry.computeVertexNormals();

    const tipGeometry = new ShapeGeometry(shape).toNonIndexed();
    tipGeometry.translate(0, 0, -yOutline[0]);
    tipGeometry.deleteAttribute("uv");

    merged = BufferGeometryUtils.mergeGeometries([wingGeometry, tipGeometry]);
    tipGeometry.translate(0, 0, 2 * yOutline[0]);
    merged = BufferGeometryUtils.mergeGeometries([merged, tipGeometry]);
    setGeom(merged);
  };

  useEffect(() => {
      (pathname === "/aerodynamics/fuselage" || pathname === "/") &&
      createModel();
  }, [profilePoints, pathname]);

  return { geom };
};
export default useWingModel;
