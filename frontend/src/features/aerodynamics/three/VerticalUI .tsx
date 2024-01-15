import { Props } from "../../common/types/three";
import Inputs3D from "../../common/three/Inputs3D";
import { usePlaneStore } from "../stores/usePlane";
import FuselageChart from "./FuselageChart";
import { useVerticalStore } from "../stores/useVertical";
import WingShape from "../WingShape";

const VerticalUI = ({ opacity }: Props) => {
  const shape = useVerticalStore((state) => state.shape);
  const setShape = useVerticalStore((state) => state.setShape);

  return (
    <mesh rotation={[(-20 * Math.PI) / 180, 0, 0, "YXZ"]}>
      <Inputs3D gridPositionX={0.25}>
        <div className="w-48">
          <WingShape label="Stabilizer" shape={shape} setter={setShape} />
        </div>
        {/* <FuselageChoose />
        <FuselageConfiguration /> */}
        {/* <InputToggle
          label="Measurements"
          value={measurements}
          setter={setMeasurements}
        /> */}
      </Inputs3D>
      <FuselageChart opacity={opacity} />
    </mesh>
  );
};

export default VerticalUI;
