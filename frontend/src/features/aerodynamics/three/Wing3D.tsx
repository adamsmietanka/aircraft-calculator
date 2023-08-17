import { useEffect, useMemo, useRef, useState } from "react";
import { WingState, useWingStore } from "../stores/useWing";
import { Sphere, TransformControls } from "@react-three/drei";
import { Mesh } from "three";
import {
  useChain,
  useSpringRef,
  animated,
  useSpring,
} from "@react-spring/three";
import Line from "../../common/three/Line";
import { useThree } from "@react-three/fiber";
import { useCSSColors } from "../../common/three/config";
import { getStep } from "../../common/three/hooks/useAxes";
import Scale from "./Scale";

const Wing3D = () => {
  const wing = useWingStore();
  const [active, setActive] = useState<THREE.Object3D>(null!);

  const leadingTip = useRef<Mesh>(null);
  const trailingTip = useRef<Mesh>(null);
  const trailingFuselage = useRef<Mesh>(null);

  const SCALE = 0.25;

  const getXTip = (angle: number, span: number) =>
    (Math.tan((angle * Math.PI) / 180) * span) / 2;

  const onTransform = (e: THREE.Event | undefined) => {
    if (e && e.target.object) {
      const { isTip, isTrailing, isFuselage } = e.target.object.userData;
      const { x, y } = e.target.object.position;

      if (isTip) {
        useWingStore.setState({ span: y * 2 });

        if (isTrailing) {
          const angle = useWingStore.getState().angle;
          const span = useWingStore.getState().span;
          const xTip = getXTip(angle, span);

          useWingStore.setState({ chordTip: x - xTip });
        }
      } else if (isFuselage) {
        useWingStore.setState({ chord: x });
      }
    }
  };

  const updateWing = ({ chord, chordTip, span, angle }: WingState) => {
    if (leadingTip.current && trailingTip.current && trailingFuselage.current) {
      const xTip = getXTip(angle, span);

      leadingTip.current.position.setY(span / 2);
      leadingTip.current.position.setX(xTip);

      trailingTip.current.position.setY(span / 2);
      trailingTip.current.position.setX(xTip + chordTip);

      trailingFuselage.current.position.setX(chord);
      trailingFuselage.current.position.setY(0);
    }
  };

  useEffect(() => {
    useWingStore.subscribe(updateWing);

    const state = useWingStore.getState();
    updateWing(state);
  }, []);

  const lineRef = useSpringRef();
  const scaleRef = useSpringRef();

  useChain([lineRef, scaleRef]);

  const trace = useMemo(() => {
    const xTip = getXTip(wing.angle, wing.span);
    return {
      name: "",
      points: [
        [0, 0, 0],
        [xTip, wing.span / 2, 0],
        [xTip + wing.chordTip, wing.span / 2, 0],
        [wing.chord, 0, 0],
        [xTip + wing.chordTip, -wing.span / 2, 0],
        [xTip, -wing.span / 2, 0],
        [0, 0, 0],
      ],
    };
  }, [wing]);

  const AnimatedTransform = animated(TransformControls);
  const AnimatedSphere = animated(Sphere);

  const [gizmoSpring] = useSpring(
    () => ({
      size: !!active ? 0.6 : 0,
    }),
    [active]
  );
  const { height, width } = useThree((state) => state.viewport);

  const [wingSpring] = useSpring(
    () => ({
      scale: Math.min(
        (0.8 * height) / wing.span,
        (0.5 * width) / (getXTip(wing.angle, wing.span) + wing.chordTip + 0.5),
        (0.5 * width) / (wing.chord + 0.5)
      ),
      rotationZ: ((90 - wing.angle) * Math.PI) / 180,
    }),
    [wing.span, wing.angle, wing.chord, wing.chordTip, height]
  );

  const { primaryColor, secondaryColor, errorColor, gridColor } =
    useCSSColors();

  return (
    <animated.mesh scale={wingSpring.scale}>
      <Scale
        length={getStep(wing.span / 1.5)}
        scale={wingSpring.scale}
        springRef={scaleRef}
      />
      <AnimatedTransform
        scale={wingSpring.scale.to((scale) => 1 / scale)}
        size={gizmoSpring.size}
        showZ={false}
        showY={!active?.userData.isFuselage && active?.userData.isTrailing}
        mode="translate"
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
