import { TransformControls } from "@react-three/drei";
import { animated, SpringValue, to } from "@react-spring/three";
import Line from "../../common/three/Line";
import Scale from "./Scale";
import useWing3D from "./hooks/useWing3D";
import useWingSprings from "./hooks/useWingSprings";
import WingSpheres from "./WingSpheres";
import WingInputs from "./WingInputs";
import { CANVAS_WIDTH } from "../../common/three/config";
import WingHoverables from "./WingHoverables";
import ProfileOutlines from "./ProfileOutlines";

interface Props {
  size: number[];
  gridPositionX: number;
  opacity: SpringValue<number>;
}

const Wing3D = ({ size, gridPositionX, opacity }: Props) => {
  const { onTransform, leadingEdge, trailingEdge, active, setActive, step } =
    useWing3D();

  const { gizmoSpring, wingSpring } = useWingSprings(active, size);

  const AnimatedTransform = animated(TransformControls);

  return (
    <>
      <AnimatedTransform
        size={to(
          [gizmoSpring.size, opacity],
          (size, stepActive) => size * stepActive
        )}
        showZ={false}
        showX={active?.userData.isTrailing}
        showY={active?.userData.isTip}
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
          <Scale length={step} scale={wingSpring.scale} />
          <WingHoverables scale={wingSpring.scale} />
          <WingSpheres
            scale={wingSpring.scale}
            onClick={(e) => setActive(e.object)}
            active={active}
            chord={wingSpring.chord}
            chordTip={wingSpring.chordTip}
            x={wingSpring.x}
            y={wingSpring.y}
            rotationZ={wingSpring.rotationZ}
          />
          <WingInputs
            scale={wingSpring.scale}
            chord={wingSpring.chord}
            chordTip={wingSpring.chordTip}
            angle={wingSpring.angle}
            x={wingSpring.x}
            y={wingSpring.y}
          />
          <ProfileOutlines />
          <Line trace={leadingEdge} opacity={opacity} />
          <Line trace={trailingEdge} opacity={opacity} />
        </animated.mesh>
      </animated.mesh>
    </>
  );
};

export default Wing3D;
