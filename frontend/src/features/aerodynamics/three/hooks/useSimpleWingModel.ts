import { useEffect, useMemo, useState } from "react";
import { BufferAttribute, BufferGeometry, Shape, ShapeGeometry } from "three";
import { useLocation } from "react-router-dom";
import { NUMBER_OF_AIRFOIL_SEGMENTS } from "../../../common/three/config";
import { useProfileStore } from "../../stores/useProfile";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";

const PANELS = 2 * NUMBER_OF_AIRFOIL_SEGMENTS + 1;

const useSimpleWingModel = () => {
  const { pathname } = useLocation();

  const profilePoints = useProfileStore((state) => state.profile);

  const wingGeometry = useMemo(() => new BufferGeometry(), []);
  const [geom, setGeom] = useState<BufferGeometry>(null!);

  const createModel = () => {
    let merged;
    let arr = [];

    const right = profilePoints.map(([x, y, z]) => [x, y, -1]);

    const left = profilePoints.map(([x, y, z]) => [x, y, 1]);

    for (let i = 0; i < PANELS; i++) {
      arr.push(...right[i]);
      arr.push(...right[i + 1]);
      arr.push(...left[i]);
      arr.push(...right[i + 1]);
      arr.push(...left[i + 1]);
      arr.push(...left[i]);
    }
    const attr = new BufferAttribute(new Float32Array(arr), 3);
    wingGeometry.setAttribute("position", attr);
    wingGeometry.computeVertexNormals();

    const shape = new Shape();
    profilePoints.forEach(([x, y]) => {
      shape.lineTo(x, y);
    });
    const tipGeometry = new ShapeGeometry(shape).toNonIndexed();
    tipGeometry.translate(0, 0, 1);
    tipGeometry.deleteAttribute("uv");

    merged = BufferGeometryUtils.mergeGeometries([wingGeometry, tipGeometry]);
    tipGeometry.translate(0, 0, -2);
    merged = BufferGeometryUtils.mergeGeometries([merged, tipGeometry]);
    setGeom(merged);
  };

  useEffect(() => {
    profilePoints.length &&
      pathname === "/aerodynamics/inducedDrag" &&
      createModel();
  }, [profilePoints, pathname]);

  useEffect(() => {
    profilePoints.length && createModel();
  }, []);
  return { geom };
};
export default useSimpleWingModel;
