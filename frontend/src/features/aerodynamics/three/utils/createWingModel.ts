import { getXTip } from "../hooks/useWingSpring";
import { BufferAttribute, BufferGeometry, Shape, ShapeGeometry } from "three";
import { NUMBER_OF_AIRFOIL_SEGMENTS } from "../../../common/three/config";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import getEllipticOutline from "../../utils/getEllipticOutline";

const PANELS = 2 * NUMBER_OF_AIRFOIL_SEGMENTS + 1;

const createWingModel = (
  config: {
    span: number;
    chord: number;
    chordTip: number;
    angle: number;
    shape: number;
  },
  profilePoints: number[][],
  full = true
) => {
  const { span, chord, chordTip, angle, shape } = config;

  const xTip = getXTip(angle, span);

  const getOutline = () => {
    if (shape === 0)
      return {
        xOutline: [
          [0, chord],
          [0, chord],
          [0, chord],
        ],
        yOutline: [-span / 2, 0, span / 2],
      };
    if (shape === 1)
      return {
        xOutline: [
          [xTip, xTip + chordTip],
          [0, chord],
          [xTip, xTip + chordTip],
        ],
        yOutline: [-span / 2, 0, span / 2],
      };
    if (shape === 2) return getEllipticOutline(chord, span);
    return getEllipticOutline(chord, span, true);
  };

  const wingGeometry = new BufferGeometry();

  const { xOutline, yOutline } = getOutline();
  const tipShape = new Shape();

  console.log("new wing created");
  let arr = [];

  for (let j = 1; j < yOutline.length; j++) {
    if (full || yOutline[j] > 0) {
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
        tipShape.moveTo(tip[0][0], tip[0][1]);

        for (let i = 1; i < PANELS; i++) {
          tipShape.lineTo(tip[i][0], tip[i][1]);
        }
      }
    }
  }

  const attr = new BufferAttribute(new Float32Array(arr), 3);
  wingGeometry.setAttribute("position", attr);
  wingGeometry.computeVertexNormals();

  const tipGeometry = new ShapeGeometry(tipShape).toNonIndexed();
  tipGeometry.translate(0, 0, -yOutline[0]);
  tipGeometry.deleteAttribute("uv");

  let geom = BufferGeometryUtils.mergeGeometries([wingGeometry, tipGeometry]);

  if (full) {
    tipGeometry.translate(0, 0, 2 * yOutline[0]);
    geom = BufferGeometryUtils.mergeGeometries([geom, tipGeometry]);
  }

  return geom;
};

export default createWingModel;
