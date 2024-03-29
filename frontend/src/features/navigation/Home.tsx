import {
  Center,
  Cloud,
  Clouds,
  Float,
  Text3D,
  Instances,
  Instance,
} from "@react-three/drei";
import useLandingPage from "./hooks/useLandingPage";
import { useMemo } from "react";
import { MeshStandardMaterial } from "three";
import Contact from "./Contact";

const SPAR_DIAMETER = 0.03;

const Home = () => {
  const { geom1, geom2, vertical, elliptic, tail, tailSquare, fuse1, fuse2 } =
    useLandingPage();

  const material = useMemo(() => {
    return new MeshStandardMaterial({ metalness: 0.5 });
  }, []);

  return (
    <mesh receiveShadow>
      <Clouds>
        <Cloud
          seed={3}
          position={[0, 0, 40]}
          opacity={0.25}
          speed={0.1} // Rotation speed
          bounds={[20, 6, 1]}
          volume={30}
          segments={10} // Number of particles
        />
      </Clouds>

      <Float
        speed={1} // Animation speed, defaults to 1
        rotationIntensity={0.05} // XYZ rotation intensity, defaults to 1
        floatIntensity={0.5} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
      >
        <Center position={[0.2, 0.05, 60]}>
          <Text3D
            font="/fonts/Roboto Medium_Regular.json"
            lineHeight={0.75}
            size={1.75}
            height={0.25}
            curveSegments={32}
            bevelEnabled
            bevelSize={0.01}
            bevelThickness={0.1}
          >
            {"Book \n   of\nFlight"}
            <meshPhongMaterial />
          </Text3D>
        </Center>
      </Float>
      <Float
        position={[-5, 0, 0]}
        rotation={[0, Math.PI / 8, Math.PI / 16]}
        rotationIntensity={0.25}
        floatIntensity={5}
        speed={1.5}
      >
        <mesh position={[-6, 1.5, 50]} receiveShadow scale={1.25}>
          <Instances limit={4} position-y={1.25 / 2} position-x={0.1}>
            <cylinderGeometry args={[SPAR_DIAMETER, SPAR_DIAMETER, 1.25, 32]} />
            <meshStandardMaterial color={"white"} metalness={0.5} />
            <Instance position={[0.2, 0, -2.75]} />
            <Instance position={[1.2, 0, -2.75]} />
            <Instance position={[0.2, 0, 2.75]} />
            <Instance position={[1.2, 0, 2.75]} />
          </Instances>
          <mesh geometry={geom2} scale-z={0.5} material={material} />
          <mesh
            geometry={geom2}
            scale-z={0.5}
            position-y={1.25}
            material={material}
          />
          <mesh
            position-x={6.25}
            position-y={0.65}
            rotation-x={-Math.PI / 2}
            geometry={elliptic}
            material={material}
          />
          <mesh
            position-x={6.25}
            position-y={0.45}
            geometry={tail}
            material={material}
          />
          <mesh
            scale={9}
            position-x={-1.5}
            geometry={fuse2}
            material={material}
          />
        </mesh>
      </Float>
      <Float
        position={[1.5, 3, -0.5]}
        rotation={[0, 0, Math.PI / 16]}
        rotationIntensity={0.35}
        floatIntensity={5}
        speed={1.5}
      >
        <mesh
          position={[-12, 0, 38]}
          receiveShadow
          scale={[-1.45, 1.45, 1.45]}
          rotation={[-Math.PI / 16, 0, 0]}
        >
          <mesh geometry={geom1} material={material} />

          <mesh
            scale={9}
            scale-x={10.5}
            position-x={-1.5}
            geometry={fuse1}
            material={material}
          />
          <mesh
            position-x={7.5}
            position-y={0.65}
            rotation-x={-Math.PI / 2}
            geometry={vertical}
            material={material}
          />
          <mesh
            position-x={8.1}
            position-y={1.95}
            geometry={tailSquare}
            material={material}
          />
        </mesh>
      </Float>
      <Contact />
    </mesh>
  );
};

export default Home;
