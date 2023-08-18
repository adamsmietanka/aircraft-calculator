import { useRef } from "react";
import { TransformControls } from "@react-three/drei";
import { Mesh } from "three";
import { useChain, useSpringRef, animated } from "@react-spring/three";
import Line from "../../common/three/Line";
import Scale from "./Scale";
import useWing3D from "./hooks/useWing3D";
import useWingSprings from "./hooks/useWingSprings";
import WingSpheres from "./WingSpheres";
import WingInputs from "./WingInputs";

const Wing3D = () => {
  const leadingTip = useRef<Mesh>(null);
  const trailingTip = useRef<Mesh>(null);
  const trailingFuselage = useRef<Mesh>(null);

  const { onTransform, trace, active, setActive, step } = useWing3D(
    leadingTip,
    trailingTip,
    trailingFuselage
  );

  const { gizmoSpring, wingSpring } = useWingSprings(active);

  const lineRef = useSpringRef();
  const scaleRef = useSpringRef();

  useChain([lineRef, scaleRef]);

  const AnimatedTransform = animated(TransformControls);

  return (
    <animated.mesh scale={wingSpring.scale}>
      <Scale length={step} scale={wingSpring.scale} springRef={scaleRef} />
      <AnimatedTransform
        scale={wingSpring.scale.to((scale) => 1 / scale)}
        size={gizmoSpring.size}
        showZ={false}
        showY={!active?.userData.isFuselage && active?.userData.isTrailing}
        onChange={onTransform}
        object={active}
        space="local"
        translationSnap={0.1}
      />
      <WingSpheres
        leadingTip={leadingTip}
        trailingTip={trailingTip}
        trailingFuselage={trailingFuselage}
        scale={wingSpring.scale}
        rotationZ={wingSpring.rotationZ}
        onClick={(e) => setActive(e.object)}
      />
      <WingInputs scale={wingSpring.scale} x={wingSpring.x} y={wingSpring.y} />
      <Line trace={trace} scale={[1, 1, 1]} springRef={lineRef} />
    </animated.mesh>
  );
};

export default Wing3D;
