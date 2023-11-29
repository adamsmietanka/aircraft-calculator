import React from "react";
import { Center, Cloud, Cylinder, Float, Text3D } from "@react-three/drei";
import WingModel from "../aerodynamics/three/WingModel";
import { SpringValue } from "@react-spring/three";
import FuseModel from "../aerodynamics/three/FuseModel";
import { DoubleSide } from "three";

interface Props {
  opacity: SpringValue<number>;
}

const SPAR_DIAMETER = 0.03;

const Home = ({ opacity }: Props) => {
  return (
    <mesh receiveShadow>
      <Cloud
        position={[0, 0, 50]}
        opacity={0.25}
        speed={0.4} // Rotation speed
        width={7.5} // Width of the full cloud
        depth={1.5} // Z-dir depth
        segments={20} // Number of particles
      />
      <spotLight position={[-10, 10, 70]} intensity={0.5} />
      <spotLight position={[-10, -40, 70]} intensity={0.1} />
      <Float
        speed={1} // Animation speed, defaults to 1
        rotationIntensity={0.1} // XYZ rotation intensity, defaults to 1
        floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
      >
        <Center position={[0.2, 0.05, 60]}>
          <Text3D
            font="/fonts/Roboto Medium_Regular.json"
            lineHeight={0.75}
            // letterSpacing={-0.025}
            size={1.75}
            height={0.25}
            curveSegments={32}
            bevelEnabled
            bevelSize={0.01}
            bevelThickness={0.1}
          >
            {"Book \n   of\nFlight"}
            <meshPhongMaterial></meshPhongMaterial>
          </Text3D>
        </Center>
      </Float>
      <Float
        position={[1, 0, 0]}
        rotation={[0, Math.PI / 8, Math.PI / 16]}
        rotationIntensity={1}
        floatIntensity={10}
        speed={1.75}
      >
        <mesh position={[0, 0, 45]} receiveShadow>
          <mesh position-y={1.25 / 2} position-x={0.1}>
            {/* <Cylinder args={[SPAR_DIAMETER, SPAR_DIAMETER, 1.25, 32]} /> */}
            <mesh position-z={2.75} position-x={0.2}>
              <Cylinder args={[SPAR_DIAMETER, SPAR_DIAMETER, 1.25, 32]}>
                <meshStandardMaterial
                  color={"lightgray"}
                  side={DoubleSide}
                  metalness={1}
                />
              </Cylinder>
              <mesh position-x={1.2}>
                <Cylinder args={[SPAR_DIAMETER, SPAR_DIAMETER, 1.25, 32]}>
                  <meshStandardMaterial
                    color={"lightgray"}
                    side={DoubleSide}
                    metalness={1}
                  />
                </Cylinder>
              </mesh>
            </mesh>
            <mesh position-z={-2.75} position-x={0.2}>
              <Cylinder args={[SPAR_DIAMETER, SPAR_DIAMETER, 1.25, 32]}>
                <meshStandardMaterial
                  color={"lightgray"}
                  side={DoubleSide}
                  metalness={1}
                />
              </Cylinder>
              <mesh position-x={1.2}>
                <Cylinder args={[SPAR_DIAMETER, SPAR_DIAMETER, 1.25, 32]}>
                  <meshStandardMaterial
                    color={"lightgray"}
                    side={DoubleSide}
                    metalness={1}
                  />
                </Cylinder>
              </mesh>
            </mesh>
          </mesh>
          <mesh scale-z={0.5}>
            <WingModel opacity={opacity} shape={0} />
          </mesh>
          <mesh scale-z={0.5} position-y={1.25}>
            <WingModel opacity={opacity} shape={0} />
          </mesh>
          <FuseModel opacity={opacity} />
        </mesh>
      </Float>
      <Float
        position={[1, 1.1, -0.5]}
        rotation={[0, 0, 0]}
        rotationIntensity={3}
        floatIntensity={2}
        speed={1.25}
      >
        <mesh position={[-30, 0, 25]} receiveShadow scale-x={-1}>
          <mesh scale-z={1.5}>
            <WingModel opacity={opacity} shape={1} />
          </mesh>
          <mesh scale-x={1.5}>
            <FuseModel opacity={opacity} />
          </mesh>
        </mesh>
      </Float>
    </mesh>
  );
};

export default Home;
