import {
  Center,
  Cloud,
  Clouds,
  Float,
  Text3D,
  Instances,
  Instance,
} from "@react-three/drei";
import { SpringValue, animated } from "@react-spring/three";
import FuseModel from "../aerodynamics/three/FuseModel";
import useLandingPage from "./hooks/useLandingPage";

interface Props {
  opacity: SpringValue<number>;
}

const SPAR_DIAMETER = 0.03;

const Home = ({ opacity }: Props) => {
  const { geom1, geom2, geom3 } = useLandingPage();

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
        rotationIntensity={0.1} // XYZ rotation intensity, defaults to 1
        floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
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
        rotationIntensity={1}
        floatIntensity={10}
        speed={1.75}
      >
        <mesh position={[0, 0, 50]} receiveShadow>
          <Instances limit={4} position-y={1.25 / 2} position-x={0.1}>
            <cylinderGeometry args={[SPAR_DIAMETER, SPAR_DIAMETER, 1.25, 32]} />
            <meshStandardMaterial color={"white"} metalness={0.5} />
            <Instance position={[0.2, 0, -2.75]} />
            <Instance position={[1.2, 0, -2.75]} />
            <Instance position={[0.2, 0, 2.75]} />
            <Instance position={[1.2, 0, 2.75]} />
          </Instances>
          <mesh geometry={geom2} scale-z={0.5}>
            <animated.meshStandardMaterial
              color={"white"}
              metalness={0.5}
              transparent
              opacity={opacity}
            />
          </mesh>
          <mesh geometry={geom2} scale-z={0.5} position-y={1.25}>
            <animated.meshStandardMaterial
              color={"white"}
              metalness={0.5}
              transparent
              opacity={opacity}
            />
          </mesh>
          <mesh
            position-x={6.25}
            position-y={0.65}
            rotation-x={-Math.PI / 2}
            geometry={geom3}
          >
            <animated.meshStandardMaterial
              color={"white"}
              metalness={0.5}
              transparent
              opacity={opacity}
            />
          </mesh>
          <FuseModel opacity={opacity} />
        </mesh>
      </Float>
      <Float
        position={[1, 1.1, -0.5]}
        rotation={[0, 0, Math.PI / 32]}
        rotationIntensity={2}
        floatIntensity={2}
        speed={1.25}
      >
        <mesh position={[-22, 0, 35]} receiveShadow scale-x={-1}>
          <mesh geometry={geom1}>
            <animated.meshStandardMaterial
              color={"white"}
              metalness={0.5}
              transparent
              opacity={opacity}
            />
          </mesh>
          <mesh scale-x={1.2}>
            <FuseModel opacity={opacity} />
          </mesh>
          <mesh
            position-x={7.75}
            position-y={0.65}
            rotation-x={-Math.PI / 2}
            geometry={geom3}
            scale-z={1.25}
          >
            <animated.meshStandardMaterial
              color={"white"}
              metalness={0.5}
              transparent
              opacity={opacity}
            />
          </mesh>
        </mesh>
      </Float>
    </mesh>
  );
};

export default Home;
