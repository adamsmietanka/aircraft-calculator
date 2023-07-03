import { Canvas, ThreeElements } from "@react-three/fiber";
import Trace from "./Trace";
import LinesVertical from "./LinesVertical";

export interface Point {
  x: number;
  y: number;
}

export type TraceProps = {
  trace: Point[];
} & ThreeElements["mesh"];

const Chart2D = ({ trace, ...props }: TraceProps) => {
  return (
    <div className="h-2/5 w-full">
      <Canvas orthographic camera={{ zoom: 30, position: [0, 0, 10] }}>
        {/* <gridHelper rotation-x={Math.PI / 2} /> */}
        {/* <axesHelper /> */}
        <Trace trace={trace} {...props} />
        <LinesVertical trace={trace} />
      </Canvas>
    </div>
  );
};

export default Chart2D;
