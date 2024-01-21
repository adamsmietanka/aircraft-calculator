import { Props } from "../../common/types/three";
import Inputs3D from "../../common/three/Inputs3D";
import { useHorizontalStore } from "../stores/useHorizontal";
import WingShape from "../WingShape";
import HorizontalChart from "./HorizontalChart";

const HorizontalUI = ({ opacity }: Props) => {
  const shape = useHorizontalStore((state) => state.shape);
  const setShape = useHorizontalStore((state) => state.setShape);

  return (
    <mesh rotation={[(-60 * Math.PI) / 180, (-20 * Math.PI) / 180, 0, "YXZ"]}>
      <Inputs3D gridPositionX={0.25}>
        <div className="w-48">
          <WingShape label="Stabilizer" shape={shape} setter={setShape} />
        </div>
      </Inputs3D>
      <HorizontalChart opacity={opacity} />
    </mesh>
  );
};

export default HorizontalUI;
