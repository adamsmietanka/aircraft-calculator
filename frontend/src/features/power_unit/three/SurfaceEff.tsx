import { ThreeElements } from "@react-three/fiber";
import { useResultsStore } from "../stores/useResults";

import { Html } from "@react-three/drei";
import { useCSSColors } from "./config";
import Surface from "./Surface";
import AnimatedSphere from "./AnimatedSphere";

const SurfaceEff = (props: ThreeElements["mesh"]) => {
  const table = useResultsStore.getState().table;

  const { traceColor, errorColor } = useCSSColors();

  return (
    <mesh {...props} scale={[0.1, 5, 1]}>
      <Surface type="eff" />
      {table.map(({ angle, eff, j, beforeMaxRPM }, index) => (
        <AnimatedSphere
          key={index}
          position={[angle, eff, j]}
          color={beforeMaxRPM ? traceColor : errorColor}
        />
      ))}
      <Html
        className="select-none"
        color="black"
        position={[70, 0.5, 6]}
        center
      >
        Eff
      </Html>
    </mesh>
  );
};

export default SurfaceEff;
