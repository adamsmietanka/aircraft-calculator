import { animated, config } from "@react-spring/three";
import { Props } from "../../common/types/three";
import { usePlaneGeometryStore } from "../stores/usePlaneGeometry";
import FuseModel from "./FuseModel";
import WingModel from "./WingModel";
import { usePlaneStore } from "../stores/usePlane";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useWingStore } from "../stores/useWing";
import { DoubleSide } from "three";
import { isMultifuse } from "../utils/planeConfiguration";

const PlaneModel = ({ opacity }: Props) => {
  const { nodes } = useLoader(GLTFLoader, "/models/fuse.glb");

  const vertical = usePlaneGeometryStore((state) => state.vertical);
  const verticalX = usePlaneStore((state) => state.verticalX);
  const verticalY = usePlaneStore((state) => state.verticalY);

  const horizontal = usePlaneGeometryStore((state) => state.horizontal);
  const horizontalX = usePlaneStore((state) => state.horizontalX);
  const horizontalY = usePlaneStore((state) => state.horizontalY);

  const configuration = usePlaneStore((state) => state.configuration);
  const fuselage = usePlaneStore((state) => state.fuselage);
  const fuselageDistance = usePlaneStore((state) => state.fuselageDistance);
  const length = usePlaneStore((state) => state.length);
  const wingX = usePlaneStore((state) => state.wingX);

  const MAC = useWingStore((state) => state.MAC);
  const MACposition = useWingStore((state) => state.MACposition);

  return (
    <mesh position-x={-(MACposition[0] + 0.28 * MAC)}>
      <mesh
        position-x={verticalX}
        position-y={verticalY}
        rotation-x={-Math.PI / 2}
        geometry={vertical}
      >
        <animated.meshStandardMaterial
          // metalness={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh
        position-x={verticalX + horizontalX}
        position-y={horizontalY}
        geometry={horizontal}
      >
        <animated.meshStandardMaterial
          color="lightgray"
          transparent
          opacity={opacity}
          side={DoubleSide}
        />
      </mesh>
      <mesh
        position-x={-wingX}
        position-z={isMultifuse(configuration) ? fuselageDistance / 2 : 0}
        geometry={nodes[fuselage]?.geometry}
        scale={length}
      >
        <animated.meshStandardMaterial
          color="lightgray"
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh
        position-x={-wingX}
        position-z={isMultifuse(configuration) ? -fuselageDistance / 2 : 0}
        geometry={nodes[fuselage]?.geometry}
        scale={length}
      >
        <animated.meshStandardMaterial
          color="lightgray"
          transparent
          opacity={opacity}
        />
      </mesh>
      <WingModel opacity={opacity} />
    </mesh>
  );
};

export default PlaneModel;
