import { Props } from "../../common/types/three";
import Inputs3D from "../../common/three/Inputs3D";
import FuselageChoose from "../FuselageChoose";
import FuselageConfiguration from "../FuselageConfiguration";
import InputToggle from "../../common/inputs/InputToggle";
import { usePlaneStore } from "../stores/usePlane";
import FuselageChart from "./FuselageChart";
import { useVerticalStore } from "../stores/useVertical";
import WingShape from "../WingShape";

const VerticalUI = ({ opacity }: Props) => {
  const measurements = usePlaneStore((state) => state.measurements);

  const setMeasurements = usePlaneStore((state) => state.setMeasurements);

  const shape = useVerticalStore((state) => state.shape);
  const setShape = useVerticalStore((state) => state.setShape);

  return (
    <mesh rotation={[(-20 * Math.PI) / 180, 0, 0, "YXZ"]}>
      <Inputs3D gridPositionX={-1.2}>
        <WingShape label="Stabilizer" shape={shape} setter={setShape} />
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
