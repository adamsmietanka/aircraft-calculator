import { ThreeElements } from '@react-three/fiber';
import { usePropellerStore } from '../stores/usePropeller';
import { useResultsStore } from '../stores/useResults';

import * as THREE from "three";
import { Html, Point, Points } from '@react-three/drei';
import { POINTS_BEFORE_MAX_RPM, useCSSColors } from './config';
import Surface from './Surface';

const SurfaceEff = (props: ThreeElements["mesh"]) => {    
    const markers = useResultsStore.getState().effMarkers;
    const variable = usePropellerStore.getState().variable;
    
    const { traceColor, errorColor } = useCSSColors()
  
    return (
      <mesh {...props} scale={[0.1, 5, 1]}>
        <Surface type='eff' />
        <Points limit={1000}>
          <pointsMaterial vertexColors size={5} sizeAttenuation={false} />
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

export default SurfaceEff