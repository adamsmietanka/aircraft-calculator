import { Props } from "../../common/types/three";
import FuseModel from "./FuseModel";
import WingModel from "./WingModel";

const PlaneModel = ({ opacity }: Props) => {
  return (
    <mesh position-x={-1.5}>
      <FuseModel opacity={opacity} />
      <WingModel opacity={opacity} />
    </mesh>
  );
};

export default PlaneModel;
