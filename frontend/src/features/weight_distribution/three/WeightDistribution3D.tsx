import { Canvas } from "@react-three/fiber";
import { Box, OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { useSettingsStore } from "../../settings/stores/useSettings";
import { useWeightStore } from "../../../data/stores/useWeightConfiguration";

const Lights = () => {
  return (
    <>
      {/* <ambientLight intensity={0.4} /> */}
      <pointLight position={[-10, 10, 10]} />
    </>
  );
};

const WeightDistribution3D = () => {
  const settings = useSettingsStore();
  const components = useWeightStore(
    (state) => state.activeWeightConfiguration.components
  );
  const MAC = useWeightStore((state) => state.activeWeightConfiguration.MAC);
  console.log(components);

  const wingSpan = 10;

  return (
    <div>
      <Canvas orthographic camera={{ zoom: 30, position: [-10, 10, 15] }}>
        <Lights />
        <gridHelper />
        <mesh position-x={-5}>
          {components.map(({ cords, mass, componentName }) => (
            <>
              {componentName.includes("Wing") && (
                <Box
                  args={[MAC, 0.1, cords.y * 2]}
                  position={[cords.x, cords.z, cords.y]}
                  material-color={"lightgreen"}
                  material-transparent={true}
                  material-opacity={0.2}
                />
              )}
              <Sphere
                position={[cords.x, cords.z, cords.y]}
                scale={0.05 * Math.pow(mass, 1 / 3)}
                material-color={componentName.includes("Wing") && "lightgreen"}
              />
            </>
          ))}
        </mesh>
        <OrbitControls
          autoRotate={settings.autoRotate}
          autoRotateSpeed={0.25}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};

export default WeightDistribution3D;
