import { Props } from "../../common/types/three";
import Inputs3D from "../../common/three/Inputs3D";
import { useHorizontalStore } from "../stores/useHorizontal";
import WingShape from "../WingShape";
import HorizontalChart from "./HorizontalChart";
import HorizontalPosition from "./HorizontalPosition";
import AnimatedHtml from "../../common/three/AnimatedHtml";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import { unitDisplay, unitMultipliers } from "../../settings/data/units";
import { useGlobalUnitsStore } from "../../settings/stores/useGlobalUnits";

const HorizontalUI = ({ opacity }: Props) => {
  const shape = useHorizontalStore((state) => state.shape);
  const setShape = useHorizontalStore((state) => state.setShape);
  const aspectRatio = useHorizontalStore((state) => state.aspectRatio);
  const area = useHorizontalStore((state) => state.area);
  const kH = useHorizontalStore((state) => state.kH);
  const lever = useHorizontalStore((state) => state.lever);

  const length = useGlobalUnitsStore((state) => state.types.length);
  const areaUnit = useGlobalUnitsStore((state) => state.types.area);

  return (
    <mesh rotation={[(-60 * Math.PI) / 180, (-20 * Math.PI) / 180, 0, "YXZ"]}>
      <Inputs3D gridPositionX={-1.75}>
        <div className="w-48">
          <WingShape label="Stabilizer" shape={shape} setter={setShape} />
          <HorizontalPosition />
        </div>
      </Inputs3D>
      <HorizontalChart opacity={opacity} />

      <AnimatedHtml position-y={-7} position-x={-18}>
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
          <HoverableFormulaSimple
            name="Stabilizer Lever"
            tex={`l_H=${(lever / unitMultipliers.length[length]).toFixed(
              2
            )}\\, ${unitDisplay.length[length]}`}
          />
          <HoverableFormulaSimple
            name="Tail Volume Coefficient"
            tex={`\\kappa_H=${kH.toFixed(2)} \\quad`}
          />
        </div>
      </AnimatedHtml>
    </mesh>
  );
};

export default HorizontalUI;
