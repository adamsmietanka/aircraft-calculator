import { Canvas, ThreeElements } from "@react-three/fiber";
import Trace from "./Trace";
import LinesVertical from "./LinesVertical";
import useAxisTicks from "./hooks/useAxisTicks";
import LinesHorizontal from "./LinesHorizontal";

export interface Point {
  x: number;
  y: number;
}

export type TraceProps = {
  trace: Point[];
} & ThreeElements["mesh"];

const Chart2D = ({ trace, ...props }: TraceProps) => {
  const [xTicks, yTicks] = useAxisTicks(trace);
  return (
    <div className="h-4/5 w-3/5">
      <Canvas orthographic camera={{ zoom: 30, position: [0, 0, 10] }}>
        {/* <gridHelper rotation-x={Math.PI / 2} /> */}
        {/* <axesHelper /> */}
        <mesh position={[-7.5, -5, 0]}>
          <Trace trace={trace} {...props} />
          <LinesVertical ticks={xTicks} />
          <LinesHorizontal ticks={yTicks} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default Chart2D;
