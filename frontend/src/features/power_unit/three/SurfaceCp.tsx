import * as THREE from "three";
import { ThreeElements } from "@react-three/fiber";
import { Point, Points, Sphere } from "@react-three/drei";

import { usePropellerStore } from "../stores/usePropeller";
import { useResultsStore } from "../stores/useResults";

import VerticalAxis from "./VerticalAxis";
import { POINTS_BEFORE_MAX_RPM, POINT_SIZE, useCSSColors } from "./config";
import Surface from "./Surface";

const SurfaceCp = (props: ThreeElements["mesh"]) => {
  const table = useResultsStore.getState().table;
  const variable = usePropellerStore.getState().variable;

  const { traceColor, infoColor, errorColor } = useCSSColors();

  return (
    <mesh {...props} scale={[0.1, 5, 1]}>
      <Surface type="cp" />
      {table.map(({ angle, cp, j }, index) => (
        <Sphere
          key={index}
          position={[angle, cp, j]}
          scale={[POINT_SIZE * 1, POINT_SIZE * 0.02, POINT_SIZE * 0.1]}
          material-color={
            !variable && index > POINTS_BEFORE_MAX_RPM ? errorColor : traceColor
          }
        />
      ))}
      <VerticalAxis />
    </mesh>
  );
};

export default SurfaceCp;
