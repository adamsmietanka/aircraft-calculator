import { useRef } from "react";
import { Sphere, TransformControls } from "@react-three/drei";
import { Mesh } from "three";
import { useChain, useSpringRef, animated } from "@react-spring/three";
import Line from "../../common/three/Line";
import { useCSSColors } from "../../common/three/config";
import Scale from "./Scale";
import useWing3D from "./hooks/useWing3D";
import useWingSprings from "./hooks/useWingSprings";

const Wing3D = () => {

  const leadingTip = useRef<Mesh>(null);
  const trailingTip = useRef<Mesh>(null);
  const trailingFuselage = useRef<Mesh>(null);

  const SCALE = 0.25;

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
  const AnimatedSphere = animated(Sphere);

  const { primaryColor, secondaryColor, errorColor, gridColor } =
    useCSSColors();

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
      <AnimatedSphere
        ref={trailingTip}
        userData={{ isTip: true, isTrailing: true }}
        onClick={(e) => setActive(e.object)}
        scale={wingSpring.scale.to((scale) => [
          SCALE / scale,
          SCALE / scale,
          SCALE / scale,
        ])}
        material-color={primaryColor}
        material-transparent
        material-opacity={0.5}
      />
      <AnimatedSphere
        ref={leadingTip}
        userData={{ isTip: true, isTrailing: false }}
        onClick={(e) => setActive(e.object)}
        scale={wingSpring.scale.to((scale) => [
          SCALE / scale,
          SCALE / scale,
          SCALE / scale,
        ])}
        rotation-z={wingSpring.rotationZ}
        material-color={primaryColor}
        material-transparent
        material-opacity={0.5}
      />
      <AnimatedSphere
        ref={trailingFuselage}
        userData={{ isFuselage: true, isTrailing: true }}
        onClick={(e) => setActive(e.object)}
        scale={wingSpring.scale.to((scale) => [
          SCALE / scale,
          SCALE / scale,
          SCALE / scale,
        ])}
        material-color={primaryColor}
        material-transparent
        material-opacity={0.5}
      />
      <Line
        trace={trace}
        scale={[1, 1, 1]}
        color={primaryColor}
        springRef={lineRef}
      />
    </animated.mesh>
  );
};

export default Wing3D;
