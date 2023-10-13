import { useMemo } from "react";
import useProfile from "../../hooks/useProfile";
import { BufferAttribute, BufferGeometry, Shape, ShapeGeometry } from "three";
import { useLocation } from "react-router-dom";
import { NUMBER_OF_AIRFOIL_POINTS } from "../../../common/three/config";

const PANELS = 2 * NUMBER_OF_AIRFOIL_POINTS + 1;

const useSimpleWingModel = () => {
  const location = useLocation();

  const { profilePoints } = useProfile();

  const tipGeometry = useMemo(() => {
    const shape = new Shape();
    profilePoints.forEach(([x, y]) => {
      shape.lineTo(x, y);
    });
    const geometry = new ShapeGeometry(shape);
    geometry.translate(0, 0, 1);
    return geometry;
  }, [profilePoints]);

  const geometry = useMemo(() => {
    const geom = new BufferGeometry();

    if (profilePoints.length) {
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
      geom.setAttribute("position", attr);
      geom.computeVertexNormals();
      return geom;
    }
  }, [profilePoints, location.pathname]);
  return { geometry, tipGeometry };
};
export default useSimpleWingModel;
