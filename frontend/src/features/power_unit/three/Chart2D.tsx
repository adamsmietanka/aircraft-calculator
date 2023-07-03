import { Canvas, ThreeElements } from "@react-three/fiber";
import Trace from "./Trace";
import LinesVertical from "./LinesVertical";
import useAxisTicks from "./hooks/useAxisTicks";

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
    <div className="h-2/5 w-full">
      <Canvas orthographic camera={{ zoom: 30, position: [0, 0, 10] }}>
        {/* <gridHelper rotation-x={Math.PI / 2} /> */}
        {/* <axesHelper /> */}
        <mesh position-x={-7.5}>
          <Trace trace={trace} {...props} />
          <LinesVertical ticks={xTicks} />
        </mesh>
      </Canvas>
    </div>
  );
};

export default Chart2D;
