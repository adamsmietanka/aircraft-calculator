import { Props } from "../../common/types/three";
import Inputs3D from "../../common/three/Inputs3D";
import { useVerticalStore } from "../stores/useVertical";
import WingShape from "../WingShape";
import VerticalChart from "./VerticalChart";

const VerticalUI = ({ opacity }: Props) => {
  const shape = useVerticalStore((state) => state.shape);
  const setShape = useVerticalStore((state) => state.setShape);

  return (
    <mesh rotation={[(-20 * Math.PI) / 180, 0, 0, "YXZ"]}>
      <Inputs3D gridPositionX={0.25}>
        <div className="w-48">
          <WingShape label="Stabilizer" shape={shape} setter={setShape} />
        </div>
      </Inputs3D>
      <VerticalChart opacity={opacity} />
    </mesh>
  );
};

export default VerticalUI;
