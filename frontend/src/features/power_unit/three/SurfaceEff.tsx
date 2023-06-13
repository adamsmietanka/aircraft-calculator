import { ThreeElements } from '@react-three/fiber';
import { usePropellerStore } from '../stores/usePropeller';
import { useResultsStore } from '../stores/useResults';

import * as THREE from "three";
import { Html, Point, Points, Sphere } from '@react-three/drei';
import { POINTS_BEFORE_MAX_RPM, POINT_SIZE, useCSSColors } from './config';
import Surface from './Surface';

const SurfaceEff = (props: ThreeElements["mesh"]) => {    
    const table = useResultsStore.getState().table;
    const variable = usePropellerStore.getState().variable;
    
    const { traceColor, errorColor } = useCSSColors()
  
    return (
      <mesh {...props} scale={[0.1, 5, 1]}>
        <Surface type='eff' />
      {table.map(({ angle, eff, j }, index) => (
        <Sphere
          key={index}
          position={[angle, eff, j]}
          scale={[POINT_SIZE * 1, POINT_SIZE * 0.02, POINT_SIZE * 0.1]}
          material-color={
            !variable && index > POINTS_BEFORE_MAX_RPM ? errorColor : traceColor
          }
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

export default SurfaceEff