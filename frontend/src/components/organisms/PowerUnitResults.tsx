import * as THREE from "three";
import { useRef, useState } from "react";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";
import { Stats, OrbitControls } from '@react-three/drei'
import { generate_verts } from "../../data/cp";

function Box(props: ThreeElements["mesh"]) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // useFrame((state, delta) => (mesh.current.rotation.y += 0.5*delta));
  const vertices = new Float32Array( [
    -1.0, -3.0,  1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  3.0,  1.0,
     1.0, -3.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.2,
     1.0,  3.0,  1.0,
     3.0, -3.0,  1.0,
     3.0, -1.0,  1.0,
     3.0,  1.0,  1.0,
     3.0,  3.0,  1.0,
     5.0, -3.0,  1.0,
     5.0, -1.0,  1.0,
     5.0,  1.0,  1.0,
     5.0,  3.0,  1.0,
     7.0, -3.0,  1.0,
     7.0, -1.0,  1.0,
     7.0,  1.0,  1.0,
     7.0,  3.0,  1.0,
     7.0, -3.0,  1.0,
     7.0, -1.0,  1.0,
     7.0,  1.0,  1.0,
     7.0,  3.0,  1.0,
     7.0, -3.0,  1.0,
     7.0, -1.0,  1.0,
     7.0,  1.0,  1.0,
     7.0,  3.0,  1.0,
     7.0, -3.0,  1.0,
     7.0, -1.0,  1.0,
     7.0,  1.0,  1.0,
     7.0,  3.0,  1.0,
     7.0, -3.0,  1.0,
     7.0, -1.0,  1.0,
     7.0,  1.0,  1.0,
     7.0,  3.0,  1.0,
     7.0, -3.0,  1.0,
     7.0, -1.0,  1.0,
     7.0,  1.0,  1.0,
     7.0,  3.0,  1.0,
     9.0, -3.0,  1.0,
     9.0, -1.0,  1.0,
     9.0,  1.0,  1.0,
     9.0,  3.0,  1.0,
  ] );
  const vertices_2 = generate_verts(50, 60)
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={[0.2, 1, 4]}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <planeBufferGeometry args={[5, 5, 60, 50]}>
        <bufferAttribute
          attach="attributes-position"
          count={vertices_2.length / 3}
          array={vertices_2}
          itemSize={3}
        />
      </planeBufferGeometry>
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} wireframe/>
    </mesh>
  );
}

const PowerUnitResults = () => {
  return (
    <Canvas>
      <axesHelper />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[0, 0, 0]} />
      <OrbitControls />
      {/* <Stats /> */}
    </Canvas>
  );
};

export default PowerUnitResults;
