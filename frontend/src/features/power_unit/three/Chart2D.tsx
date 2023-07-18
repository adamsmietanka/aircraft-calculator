import { Canvas, ThreeElements } from "@react-three/fiber";
import LineChart from "./LineChart";

export interface Axis {
  name: string;
  type?: string;
  min?: number;
  max?: number;
}

export type ChartProps = {
  trace: number[][];
  xAxis: Axis;
  yAxis: Axis;
} & ThreeElements["mesh"];

const Chart2D = ({ ...props }: ChartProps) => {
  return (
    <div className="sticky top-1/4 h-3/5 w-3/5">
      <Canvas orthographic camera={{ zoom: 30 }}>
        <LineChart {...props} />
      </Canvas>
    </div>
  );
};

export default Chart2D;
