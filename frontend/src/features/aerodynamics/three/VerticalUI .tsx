import { Props } from "../../common/types/three";
import Inputs3D from "../../common/three/Inputs3D";
import { useVerticalStore } from "../stores/useVertical";
import WingShape from "../WingShape";
import VerticalChart from "./VerticalChart";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import AnimatedHtml from "../../common/three/AnimatedHtml";
import { unitDisplay, unitMultipliers } from "../../settings/data/units";
import { useGlobalUnitsStore } from "../../settings/stores/useGlobalUnits";

const VerticalUI = ({ opacity }: Props) => {
  const shape = useVerticalStore((state) => state.shape);
  const setShape = useVerticalStore((state) => state.setShape);
  
  const area = useVerticalStore((state) => state.area);
  const aspectRatio = useVerticalStore((state) => state.aspectRatio);

  const areaUnit = useGlobalUnitsStore((state) => state.types.area);

  return (
    <mesh rotation={[(-20 * Math.PI) / 180, 0, 0, "YXZ"]}>
      <Inputs3D gridPositionX={0.25}>
        <div className="w-48 relative top-64">
          <WingShape label="Stabilizer" shape={shape} setter={setShape} />
        </div>
      </Inputs3D>
      <VerticalChart opacity={opacity} />

      <AnimatedHtml position-y={-3} position-x={2}>
        <div className="text-2xl space-y-3">
          <HoverableFormulaSimple
            name="Aspect Ratio"
            tex={`AR=${aspectRatio.toFixed(2)}`}
          />
          <HoverableFormulaSimple
            name="Stabilizer Surface"
            tex={`S=${(area / unitMultipliers.area[areaUnit]).toFixed(2)}\\, ${
              unitDisplay.area[areaUnit]
            }`}
          />
        </div>
      </AnimatedHtml>
    </mesh>
  );
};

export default VerticalUI;
