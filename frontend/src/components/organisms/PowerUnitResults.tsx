import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";
import { Stats, OrbitControls } from "@react-three/drei";
import {
  clark_2,
  generate_verts,
  generate_verts_rev,
  reverse_mesh,
} from "../../data/cp";

function Box(props: ThreeElements["mesh"]) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // useFrame((state, delta) => (mesh.current.rotation.y += 0.5*delta));
  const vertices = new Float32Array([
    -1.0, -3.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 3.0, 1.0, 1.0, -3.0,
    1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.2, 1.0, 3.0, 1.0, 3.0, -3.0, 1.0, 3.0,
    -1.0, 1.0, 3.0, 1.0, 1.0, 3.0, 3.0, 1.0, 5.0, -3.0, 1.0, 5.0, -1.0, 1.0,
    5.0, 1.0, 1.0, 5.0, 3.0, 1.0, 7.0, -3.0, 1.0, 7.0, -1.0, 1.0, 7.0, 1.0, 1.0,
    7.0, 3.0, 1.0, 7.0, -3.0, 1.0, 7.0, -1.0, 1.0, 7.0, 1.0, 1.0, 7.0, 3.0, 1.0,
    7.0, -3.0, 1.0, 7.0, -1.0, 1.0, 7.0, 1.0, 1.0, 7.0, 3.0, 1.0, 7.0, -3.0,
    1.0, 7.0, -1.0, 1.0, 7.0, 1.0, 1.0, 7.0, 3.0, 1.0, 7.0, -3.0, 1.0, 7.0,
    -1.0, 1.0, 7.0, 1.0, 1.0, 7.0, 3.0, 1.0, 7.0, -3.0, 1.0, 7.0, -1.0, 1.0,
    7.0, 1.0, 1.0, 7.0, 3.0, 1.0, 9.0, -3.0, 1.0, 9.0, -1.0, 1.0, 9.0, 1.0, 1.0,
    9.0, 3.0, 1.0,
  ]);
  // const vertices_2 = generate_verts();
  const vertices_2 = generate_verts_rev();

  useEffect(() => {
    // console.log(reverse_mesh(clark_2))
  }, []);

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={[0.2, 8, 1]}
      onClick={(event) => {
        console.log(mesh);
        // mesh.current.geometry.computeVertexNormals();
      }}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <planeGeometry
        args={[5, 5, 50, 60]}
        onUpdate={(self) => {
          self.computeVertexNormals();
          console.log(self);
        }}
      >
        <bufferAttribute
          attach="attributes-position"
          count={vertices_2.length / 3}
          array={vertices_2}
          itemSize={3}
        />
      </planeGeometry>
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} side={THREE.DoubleSide} opacity={0.5} transparent />
    </mesh>
  );
}

const PowerUnitResults = () => {
  return (
    <Canvas>
      <axesHelper />
      {/* <ambientLight /> */}
      <pointLight position={[10, 10, 10]} />
      <Box position={[0, 0, 0]} />
      <OrbitControls />
      {/* <Stats /> */}
    </Canvas>
  );
};

export default PowerUnitResults;
