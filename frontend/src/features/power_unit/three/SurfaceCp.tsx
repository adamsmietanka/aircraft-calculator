import { ThreeElements, useThree } from "@react-three/fiber";

import { useResultsStore } from "../stores/useResults";

import VerticalAxis from "./VerticalAxis";
import { POINT_SIZE, useCSSColors } from "../../common/three/config";
import Surface from "./Surface";
import AnimatedSphere from "../../common/three/AnimatedSphere";

const SurfaceCp = (props: ThreeElements["mesh"]) => {
  const table = useResultsStore.getState().table;

  const { traceColor, infoColor, errorColor } = useCSSColors();

  return (
    <mesh {...props} scale={[0.1, 5, 1]}>
      <Surface type="cp" />
      {table.map(({ angle, cp, j, beforeMaxRPM }, index) => (
        <AnimatedSphere
          key={index}
          position={[angle, cp, j]}
          color={beforeMaxRPM ? traceColor : errorColor}
          scale={[POINT_SIZE * 1, POINT_SIZE * 0.02, POINT_SIZE * 0.1]}
        />
      ))}
      <VerticalAxis />
    </mesh>
  );
};

export default SurfaceCp;
