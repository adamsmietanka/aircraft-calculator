import { ThreeElements } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";

import { useResultsStore } from "../stores/useResults";

import VerticalAxis from "./VerticalAxis";
import { POINT_SIZE, useCSSColors } from "./config";
import Surface from "./Surface";
import AnimatedSphere from "./AnimatedSphere";

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
        />
      ))}
      <VerticalAxis />
    </mesh>
  );
};

export default SurfaceCp;
