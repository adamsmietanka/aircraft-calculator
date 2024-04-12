import {
  Center,
  Cloud,
  Clouds,
  Float,
  Text3D,
  Instances,
  Instance,
} from "@react-three/drei";
import { useMemo, useRef } from "react";
import { DoubleSide, Mesh, MeshStandardMaterial } from "three";
import Contact from "./Contact";
import { Plane } from "../aerodynamics/utils/plane/Plane";
import { Props } from "../common/types/three";
import RudderNew from "../aerodynamics/three/controls/RudderNew";
import Ailerons from "../aerodynamics/three/controls/Aileron";
import Elevator from "../aerodynamics/three/controls/Elevator";
import { Propeller } from "../aerodynamics/utils/plane/Propeller";
import { useFrame } from "@react-three/fiber";

const SPAR_DIAMETER = 0.03;

const PropellerModel = ({ propeller }: { propeller: Propeller }) => {
  const material = useMemo(() => {
    return new MeshStandardMaterial({ metalness: 0.5 });
  }, []);

  const angle = 30;

  const propRef = useRef<Mesh>(null!);

  useFrame(() => {
    if (propRef.current) propRef.current.rotation.x -= 0.03;
  });

  return (
    <mesh position={propeller.position}>
      <mesh ref={propRef}>
        {[...new Array(propeller.blades)].map((_, index) => (
          <mesh
            key={index}
            geometry={propeller.geometry}
            material={material}
            rotation-z={
              (angle * Math.PI) / 180 + propeller.getThreeFourthsAngle()
            }
            rotation-x={(2 * Math.PI * index) / propeller.blades}
          />
        ))}
      </mesh>
      <mesh
        geometry={propeller.spinner}
        position-x={-0.25}
        material={material}
      />
    </mesh>
  );
};

const Home = ({ opacity }: Props) => {
  const materialDouble = useMemo(() => {
    return new MeshStandardMaterial({ metalness: 0.5, side: DoubleSide });
  }, []);

  const plane = useMemo(
    () =>
      new Plane({
        wing: {
          span: 6,
          chord: 2,
        },
        vertical: {
          shape: 2,
        },
        horizontal: {
          span: 4,
          chord: 1.25,
          chordTip: 0.65,
          angle: 5,
          shape: 1,
        },
        fuselage: { shape: 2302, length: 9, wingX: 1.5, configuration: 1 },
        propeller: { blades: 2, diameter: 3, chord: 0.2 },
      }),
    []
  );

  const plane2 = useMemo(
    () =>
      new Plane({
        wing: {
          span: 12,
          chord: 2,
          shape: 1,
          angle: 10,
        },
        vertical: {
          shape: 1,
        },
        horizontal: {
          span: 4,
          chord: 1.25,
          chordTip: 0.65,
          angle: 5,
          shape: 1,
        },
        fuselage: { shape: 2303, length: 10, wingX: 1.8 },
        propeller: { blades: 4, diameter: 0, chord: 0.2 },
      }),
    []
  );

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
          {/* <mesh
            geometry={geom2}
            scale-z={0.5}
            position-y={1.25}
            material={material}
          /> */}
          <RudderNew opacity={opacity} stabilizer={plane.vertical} />
          <Elevator opacity={opacity} stabilizer={plane.horizontal} />
          <Ailerons opacity={opacity} wing={plane.wing} />
          <mesh geometry={plane.geometry} material={materialDouble} />
          <PropellerModel propeller={plane.propeller} />
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
          <RudderNew opacity={opacity} stabilizer={plane2.vertical} />
          <Elevator opacity={opacity} stabilizer={plane2.horizontal} />
          <Ailerons opacity={opacity} wing={plane2.wing} />
          <mesh geometry={plane2.geometry} material={materialDouble} />
        </mesh>
      </Float>
      <Contact />
    </mesh>
  );
};

export default Home;
