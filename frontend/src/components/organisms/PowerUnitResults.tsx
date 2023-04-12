import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";
import { Stats, OrbitControls } from "@react-three/drei";
import { clark_2 } from "../../data/cp";

function Box(props: ThreeElements["mesh"]) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // useFrame((state, delta) => (mesh.current.rotation.y += 0.5*delta));

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
          count={clark_2.verts.length / 3}
          array={clark_2.verts}
          itemSize={3}
        />
      </planeGeometry>
      <meshStandardMaterial
        color={hovered ? "hotpink" : "orange"}
        side={THREE.DoubleSide}
        opacity={0.5}
        transparent
      />
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
