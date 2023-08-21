import { TransformControls } from "@react-three/drei";
import {
  useChain,
  useSpringRef,
  animated,
  SpringValue,
} from "@react-spring/three";
import Line from "../../common/three/Line";
import Scale from "./Scale";
import useWing3D from "./hooks/useWing3D";
import useWingSprings from "./hooks/useWingSprings";
import WingSpheres from "./WingSpheres";
import WingInputs from "./WingInputs";
import { CANVAS_WIDTH } from "../../common/three/config";

interface Props {
  size: number[];
  gridPositionX: number;
  opacity?: SpringValue<number>;
}

const Wing3D = ({ size, gridPositionX, opacity }: Props) => {
  const { onTransform, trace, active, setActive, step } = useWing3D();

  const { gizmoSpring, wingSpring } = useWingSprings(active, size);

  const lineRef = useSpringRef();
  const scaleRef = useSpringRef();

  useChain([lineRef, scaleRef]);

  const AnimatedTransform = animated(TransformControls);

  return (
    <>
      <AnimatedTransform
        size={gizmoSpring.size}
        showZ={false}
        showY={!active?.userData.isFuselage && active?.userData.isTrailing}
        onChange={onTransform}
        object={active}
        space="local"
      />
      <animated.mesh
        scale={wingSpring.scale}
        position-x={(gridPositionX * size[0] * CANVAS_WIDTH) / 2}
        rotation-x={-Math.PI / 2}
      >
        <Scale length={step} scale={wingSpring.scale} springRef={scaleRef} />
        <WingSpheres
          scale={wingSpring.scale}
          rotationZ={wingSpring.rotationZ}
          onClick={(e) => setActive(e.object)}
          chord={wingSpring.chord}
          chordTip={wingSpring.chordTip}
          x={wingSpring.x}
          y={wingSpring.y}
        />
        <WingInputs
          scale={wingSpring.scale}
          chordTip={wingSpring.chordTip}
          x={wingSpring.x}
          y={wingSpring.y}
        />
        <Line
          trace={trace}
          scale={[1, 1, 1]}
          springRef={lineRef}
          opacity={opacity}
        />
      </animated.mesh>
    </>
  );
};

export default Wing3D;
