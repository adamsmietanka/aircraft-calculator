import React from "react";
import { Center, Cloud, Float, Text3D } from "@react-three/drei";

const Home = () => {
  return (
    <mesh receiveShadow>
      <Cloud
        position={[0, 0, 50]}
        opacity={0.25}
        speed={0.4} // Rotation speed
        width={10} // Width of the full cloud
        depth={1.5} // Z-dir depth
        segments={20} // Number of particles
      />
      <spotLight position={[-10, 10, 70]} intensity={0.5} />
      <Float
        speed={1} // Animation speed, defaults to 1
        rotationIntensity={0.1} // XYZ rotation intensity, defaults to 1
        floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
      >
        <Center position={[0.2, 0.05, 60]}>
          <Text3D
            font="/fonts/Roboto Medium_Regular.json"
            lineHeight={0.75}
            letterSpacing={-0.025}
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
    </mesh>
  );
};

export default Home;
