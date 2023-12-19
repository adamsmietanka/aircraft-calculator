import { useInducedDragStore } from "./stores/useInducedDrag";
import { Props } from "../../../common/types/three";
import { useWingStore } from "../../stores/useWing";
import { useProfileChartsStore } from "../../hooks/useProfileCharts";
import useWingScale from "../../hooks/useWingScale";
import VectorNew from "../../../common/three/VectorNew";
import HoverableFormulaSimple from "../../../common/HoverableFormulaSimple";

const InducedDragForces = ({ opacity }: Props) => {
  const isWing = useInducedDragStore((state) => state.isWing);
  const showLift = useInducedDragStore((state) => state.lift);
  const drag = useInducedDragStore((state) => state.drag);
  const effLift = useInducedDragStore((state) => state.effLift);

  const reynolds = useWingStore((state) => state.reynolds);
  const chart = useProfileChartsStore();
  
  const { scaleProfile } = useWingScale();

  const speed = reynolds / 6;
  const spanWiseSpeed = 0.2 * chart.yHover * speed;
  const downWashAngle = Math.atan(spanWiseSpeed / speed);
  const lift = chart.yHover * speed * speed * 1.25;

  return (
    <mesh scale={1 / scaleProfile} position-x={0.25} position-z={1}>
      <VectorNew
        x={isWing ? lift * Math.sin(downWashAngle) : 0}
        y={isWing ? lift * Math.cos(downWashAngle) : lift}
        show={showLift}
        opacity={opacity}
        color="primary"
      >
        <HoverableFormulaSimple name="Lift" tex="L" />
      </VectorNew>
      <VectorNew
        x={lift * Math.sin(downWashAngle)}
        show={drag}
        opacity={opacity}
        color="error"
      >
        <HoverableFormulaSimple name="Induced Drag" tex="D_i" />
      </VectorNew>
      <VectorNew
        y={lift * Math.cos(downWashAngle)}
        show={effLift}
        opacity={opacity}
        color="secondary"
      >
        <div className="mr-16 mt-10">
          <HoverableFormulaSimple name="Effective Lift" tex="L_{eff}" />
        </div>
      </VectorNew>
    </mesh>
  );
};

export default InducedDragForces;
