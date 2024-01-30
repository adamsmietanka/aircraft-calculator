import { animated } from "@react-spring/three";
import { Props } from "../../common/types/three";
import { usePlaneGeometryStore } from "../stores/usePlaneGeometry";
import FuseModel from "./FuseModel";
import WingModel from "./WingModel";
import { usePlaneStore } from "../stores/usePlane";

const PlaneModel = ({ opacity }: Props) => {
  const vertical = usePlaneGeometryStore((state) => state.vertical);
  const verticalX = usePlaneStore((state) => state.verticalX);
  const verticalY = usePlaneStore((state) => state.verticalY);

  return (
    <mesh position-x={-1.5}>
      <mesh
        position-x={verticalX}
        position-y={verticalY}
        rotation-x={-Math.PI / 2}
        geometry={vertical}
      >
        <animated.meshStandardMaterial
          metalness={0.5}
          transparent
          opacity={opacity}
        />
      </mesh>
      <FuseModel opacity={opacity} />
      <WingModel opacity={opacity} />
    </mesh>
  );
};

export default PlaneModel;
