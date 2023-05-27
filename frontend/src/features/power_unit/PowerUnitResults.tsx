import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";
import { Stats, OrbitControls, useHelper, Html } from "@react-three/drei";
import { cp } from "../../data/cp";
import {
  generate_verts,
  generate_verts_rev,
  rotate_mesh,
} from "../../utils/three/meshGeneration";
import { useResultsStore } from "./stores/useResults";
import InputAltitude from "../common/InputAltitude";
import PowerUnitPropellerBlades from "./PowerUnitPropellerBlades";
import PowerUnitPropellerPitch from "./PowerUnitPropellerPitch";
import InputDisabled from "../common/InputDisabled";
import { usePower } from "./hooks/usePower";
import { usePropellerStore } from "./stores/usePropeller";
import { useEngineStore } from "./hooks/useEngine";
import { barycentricAngle } from "../../utils/interpolation/binarySearch";
import { verts } from "../../data/verts";
import { eff } from "../../data/eff";

interface SurfaceProps {
  cpMarkers: Float32Array;
}

const Surface = ({ cpMarkers }: SurfaceProps) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const points = useRef<THREE.Points>(null!);
  const positionsRef = useRef<THREE.BufferAttribute>(null);
  const surfacePositionsRef = useRef<THREE.BufferAttribute>(null);

  const blades = usePropellerStore((state) => state.blades);

  const chartType = "cp";

  const center = useMemo(() => {
    if (mesh.current) {
      mesh.current.geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      mesh.current.geometry.boundingBox?.getCenter(center);
      return center;
    }
  }, []);

  useFrame((state, dt) => {
    if (positionsRef.current) {
      positionsRef.current.set(cpMarkers);
      positionsRef.current.needsUpdate = true;
    }
    if (surfacePositionsRef.current) {
      surfacePositionsRef.current.set(verts[chartType][blades]);
      surfacePositionsRef.current.needsUpdate = true;
    }
  });
  return (
    <mesh ref={mesh} scale={[0.1, 6, 1]}>
      <planeGeometry
        args={[5, 5, 50, 60]}
        onUpdate={(self) => {
          self.computeVertexNormals();
          console.log(self);
        }}
      >
        <bufferAttribute
          ref={surfacePositionsRef}
          attach="attributes-position"
          count={verts[chartType][blades].length / 3}
          array={verts[chartType][blades]}
          itemSize={3}
        />
      </planeGeometry>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            ref={positionsRef}
            attach="attributes-position"
            count={cpMarkers.length / 3}
            array={cpMarkers}
            itemSize={3}
            // usage={THREE.DynamicDrawUsage}
          />
        </bufferGeometry>
        <pointsMaterial
          attach="material"
          color={"blue"}
          size={5}
          sizeAttenuation={false}
        />
      </points>

      <meshStandardMaterial
        color="lightgreen"
        side={THREE.DoubleSide}
        opacity={0.6}
        transparent
        wireframe
      />
      <Html
        className="select-none"
        color="black"
        scale={[10, 0.1, 1]}
        up={[0, -10, 0]}
        position={[35, 0, 0]}
        center
      >
        Angle
      </Html>
      <Html
        className="select-none"
        color="black"
        scale={[10, 0.1, 1]}
        position={[60, 0.2, 0]}
        center
      >
        Cp
      </Html>
      <Html
        className="select-none"
        color="black"
        scale={[10, 0.1, 1]}
        position={[8, 0, 2.5]}
        center
      >
        J
      </Html>
    </mesh>
  );
};

const Lights = () => {
  const pointLightRef = useRef(null!);
  useHelper(pointLightRef, THREE.PointLightHelper, 100);
  return (
    <>
      <pointLight ref={pointLightRef} position={[10, 10, 10]} />
    </>
  );
};

interface Point {
  v: number;
  j: number;
  angle: number;
}

const PowerUnitResults = () => {
  const altitude = useResultsStore((state) => state.altitude);
  const engineSpeed = useEngineStore((state) => state.engineSpeed);
  const reductionRatio = useEngineStore((state) => state.reductionRatio);
  const diameter = usePropellerStore((state) => state.diameter);
  const speed = usePropellerStore((state) => state.cruiseSpeed);
  const blades = usePropellerStore((state) => state.blades);
  const setAltitude = useResultsStore((state) => state.setAltitude);
  const cpMarkers = useResultsStore((state) => state.cpMarkers);
  const setCpMarkers = useResultsStore((state) => state.setCpMarkers);

  const [table, setTable] = useState<Point[]>();

  const [calculatePower] = usePower();
  const power = calculatePower(altitude);
  const density = 1.2255 * (1 - altitude / 44.3) ** 4.256;
  const propellerSpeed = (engineSpeed * reductionRatio) / 60;
  const Cp = (power * 1000) / (density * propellerSpeed ** 3 * diameter ** 5);
  const cpMesh = useMemo(() => cp[blades], [blades]);

  useEffect(() => {
    console.log(eff);
    const table = [];
    const markers = [];
    for (let v = 0; v <= 1.2 * speed; v += 10) {
      const j = v / (propellerSpeed * diameter);
      // const rpm = propellerSpeed * 60 / Ratio
      const angle = barycentricAngle(cpMesh.J, cpMesh.angles, cpMesh.Z, j, Cp);
      table.push({ v, j, angle });
      markers.push(angle, Cp, j);
    }
    setTable(table);
    setCpMarkers(new Float32Array(markers));
    console.log(generate_verts(rotate_mesh(cp[2])));
  }, [altitude, cpMesh, Cp, diameter, propellerSpeed, speed, setCpMarkers]);

  return (
    <div className="flex w-full p-4">
      <div className="flex flex-col w-80 mr-8 space-y-2">
        <InputAltitude value={altitude} setter={setAltitude} label="Altitude" />
        <InputDisabled
          value={Math.round(power * 100) / 100}
          label="Power"
          unit="kW"
          tooltip="Engine max power read from the Engine tab"
        />
        <InputDisabled
          value={Math.round(Cp * 10000) / 10000}
          label="Cp"
          unit="kW"
          tooltip="Coefficient of Power - this is usually stated as the amount of power the propeller absorbs"
        />
        <div className="card card-compact w-80 shadow-xl">
          <div className="card-body">
            <PowerUnitPropellerBlades />
            <PowerUnitPropellerPitch />
          </div>
        </div>
      </div>
      <div className="h-96 w-96">
        <Canvas>
          <axesHelper />
          <ambientLight intensity={0.4} />
          <Lights />
          <Surface cpMarkers={cpMarkers} />
          <OrbitControls
            autoRotate
            autoRotateSpeed={0.25}
            target={[3.5, 1, 2.5]}
          />
          {/* <Stats /> */}
        </Canvas>
      </div>
    </div>
  );
};

export default PowerUnitResults;
