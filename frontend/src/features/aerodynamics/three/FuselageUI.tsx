import { Props } from "../../common/types/three";
import Inputs3D from "../../common/three/Inputs3D";
import FuselageChoose from "../FuselageChoose";
import FuselageConfiguration from "../FuselageConfiguration";
import FuselageChart from "./FuselageChart";

const FuselageUI = ({ opacity }: Props) => {
  return (
    <mesh rotation={[(-20 * Math.PI) / 180, (-45 * Math.PI) / 180, 0, "YXZ"]}>
      <Inputs3D gridPositionX={-1.2}>
        <FuselageChoose />
        <FuselageConfiguration />
      </Inputs3D>
      <FuselageChart opacity={opacity} />
    </mesh>
  );
};

export default FuselageUI;
