import { TransformControls } from "@react-three/drei";
import { animated, SpringValue, to, useSpring } from "@react-spring/three";
import Scale from "./Scale";
import useWing3D from "./hooks/useWing3D";
import useWingSprings from "./hooks/useWingSprings";
import WingSpheres from "./WingSpheres";
import WingInputs from "./WingInputs";
import { CANVAS_WIDTH } from "../../common/three/config";
import WingHoverables from "./WingHoverables";
import ProfileOutlines from "./ProfileOutlines";
import AnimatedLine from "../../common/three/AnimatedLine";
import useWingOutline from "../hooks/useWingOutline";

interface Props {
  width: number;
  gridPositionX: number;
  opacity: SpringValue<number>;
}

const Wing3D = ({ width, gridPositionX, opacity }: Props) => {
  const { onTransform, active, setActive, step } = useWing3D();
  const { leadingPoints, trailingPoints } = useWingOutline();

  const { wingSpring } = useWingSprings(width);

  const [gizmoSpring] = useSpring(
    () => ({
      size: !!active ? 0.6 : 0,
    }),
    [active]
  );

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
        position-x={(gridPositionX * CANVAS_WIDTH) / 2}
        rotation-x={-Math.PI / 2}
      >
        <animated.mesh>
          <Scale opacity={opacity} length={step} scale={wingSpring.scale} />
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
            opacity={opacity}
          />
          <WingInputs
            scale={wingSpring.scale}
            opacity={opacity}
            chord={wingSpring.chord}
            chordTip={wingSpring.chordTip}
            angle={wingSpring.angle}
            x={wingSpring.x}
            y={wingSpring.y}
          />
          <ProfileOutlines opacity={opacity} />
          <AnimatedLine points={leadingPoints} opacity={opacity} />
          <AnimatedLine points={trailingPoints} opacity={opacity} />
        </animated.mesh>
      </animated.mesh>
    </>
  );
};

export default Wing3D;
