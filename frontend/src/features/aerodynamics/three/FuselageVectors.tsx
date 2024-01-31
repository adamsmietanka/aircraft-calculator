import { Props } from "../../common/types/three";
import VectorNew from "../../common/three/VectorNew";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import { useResultsChartStore } from "../hooks/useResultsChart";
import { useLocation } from "react-router-dom";
import Formula from "../../common/Formula";

const FuselageVectors = ({ opacity }: Props) => {
  const { pathname } = useLocation();

  const x = useResultsChartStore((state) => state.x);
  const y = useResultsChartStore((state) => state.y);
  const locked = useResultsChartStore((state) => state.locked);
  const hover = useResultsChartStore((state) => state.hover);

  const show = (pathname === "/aerodynamics/results" && !!locked) || hover;

  return (
    <mesh position-z={-1} position-x={0}>
      <VectorNew y={y["Coefficient of Drag"]} show={show} opacity={opacity}>
        <HoverableFormulaSimple
          className="transform scale-x-[-1]"
          name="Lift"
          tex="L"
        />
      </VectorNew>
      <VectorNew
        x={x["Coefficient of Drag"] * 10}
        show={show}
        opacity={opacity}
        color="error"
      >
        <div className="flex items-center">
          <HoverableFormulaSimple
            className="transform scale-x-[-1]"
            name="Drag"
            tex="D"
          />
          <Formula
            className="transform scale-x-[-1]"
            tex="\small 10 \times"
          />
        </div>
      </VectorNew>
    </mesh>
  );
};

export default FuselageVectors;
