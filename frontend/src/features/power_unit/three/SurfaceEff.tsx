import { ThreeElements } from "@react-three/fiber";
import { useResultsStore } from "../stores/useResults";

import { Html, Sphere } from "@react-three/drei";
import { POINT_SIZE, useCSSColors } from "./config";
import Surface from "./Surface";

const SurfaceEff = (props: ThreeElements["mesh"]) => {
  const table = useResultsStore.getState().table;

  const { traceColor, errorColor } = useCSSColors();

  return (
    <mesh {...props} scale={[0.1, 5, 1]}>
      <Surface type="eff" />
      {table.map(({ angle, eff, j, beforeMaxRPM }, index) => (
        <Sphere
          key={index}
          position={[angle, eff, j]}
          scale={[POINT_SIZE * 1, POINT_SIZE * 0.02, POINT_SIZE * 0.1]}
          material-color={beforeMaxRPM ? traceColor : errorColor}
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
