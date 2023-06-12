import * as THREE from "three";
import { ThreeElements } from "@react-three/fiber";
import { Point, Points } from "@react-three/drei";

import { usePropellerStore } from "../stores/usePropeller";
import { useResultsStore } from "../stores/useResults";

import VerticalAxis from "./VerticalAxis";
import { POINTS_BEFORE_MAX_RPM, useCSSColors } from "./config";
import Surface from "./Surface";

const SurfaceCp = (props: ThreeElements["mesh"]) => {
  const markers = useResultsStore.getState().cpMarkers;
  const variable = usePropellerStore.getState().variable;

  const { traceColor, infoColor, errorColor } = useCSSColors();

  return (
    <mesh {...props} scale={[0.1, 5, 1]}>
      <Surface type="cp" />
      <Points limit={1000}>
        <pointsMaterial size={5} vertexColors sizeAttenuation={false} />
        {markers.map((m, index) => (
          <Point
            key={index}
            position={[m[0], m[1], m[2]]}
            color={
              !variable && index > POINTS_BEFORE_MAX_RPM
                ? errorColor
                : traceColor
            }
          />
        ))}
      </Points>
      <VerticalAxis />
    </mesh>
  );
};

export default SurfaceCp;
