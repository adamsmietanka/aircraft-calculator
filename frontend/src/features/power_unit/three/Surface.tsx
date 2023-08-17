import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { verts } from "../data/verts";
import { usePropellerStore } from "../stores/usePropeller";
import { useCSSColors } from "../../common/three/config";
import { useSettingsStore } from "../../settings/stores/useSettings";

interface Props {
  type: "cp" | "eff";
}

const Surface = ({ type }: Props) => {
  const surfacePositionsRef = useRef<THREE.BufferAttribute>(null);

  const blades = usePropellerStore((state) => state.blades);
  const settings = useSettingsStore();

  const { surfaceColor } = useCSSColors();

  useFrame((state, dt) => {
    if (surfacePositionsRef.current) {
      surfacePositionsRef.current.set(verts[type][blades]);
      surfacePositionsRef.current.needsUpdate = true;
    }
  });

  return (
    <>
      <planeGeometry
        args={type === "eff" ? [5, 5, 100, 110] : [5, 5, 50, 60]}
        onUpdate={(self) => {
          self.computeVertexNormals();
        }}
      >
        <bufferAttribute
          ref={surfacePositionsRef}
          attach="attributes-position"
          count={verts[type][blades].length / 3}
          array={verts[type][blades]}
          itemSize={3}
        />
      </planeGeometry>

      <meshStandardMaterial
        color={surfaceColor}
        side={THREE.DoubleSide}
        opacity={0.5}
        transparent
        wireframe={settings.wireframe}
      />
    </>
  );
};

export default Surface;
