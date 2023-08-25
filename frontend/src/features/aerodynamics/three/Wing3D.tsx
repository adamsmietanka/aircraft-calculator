import { TransformControls } from '@react-three/drei';
import {
  useChain,
  useSpringRef,
  animated,
  SpringValue,
  to,
} from '@react-spring/three';
import Line from '../../common/three/Line';
import Scale from './Scale';
import useWing3D from './hooks/useWing3D';
import useWingSprings from './hooks/useWingSprings';
import WingSpheres from './WingSpheres';
import WingInputs from './WingInputs';
import { CANVAS_WIDTH } from '../../common/three/config';
import WingSurface from '../WingSurface';

interface Props {
  size: number[];
  gridPositionX: number;
  opacity: SpringValue<number>;
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
        size={to(
          [gizmoSpring.size, opacity],
          (size, stepActive) => size * stepActive
        )}
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
        visible={opacity.to((o) => o !== 0)}
      >
        <animated.mesh position-x={wingSpring.chord.to((c) => 0)}>
          <Scale length={step} scale={wingSpring.scale} springRef={scaleRef} />
          <WingSurface scale={wingSpring.scale} />
          <WingSpheres
            scale={wingSpring.scale}
            rotationZ={wingSpring.rotationZ}
            onClick={(e) => setActive(e.object)}
            chord={wingSpring.chord}
            chordTip={wingSpring.chordTip}
            x={wingSpring.x}
            y={wingSpring.y}
            stepOpacity={opacity}
          />
          <WingInputs
            scale={wingSpring.scale}
            chord={wingSpring.chord}
            chordTip={wingSpring.chordTip}
            angle={wingSpring.angle}
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
      </animated.mesh>
    </>
  );
};

export default Wing3D;
