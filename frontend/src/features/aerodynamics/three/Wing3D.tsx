import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WingState, useWingStore } from "../stores/useWing";
import AnimatedSphere from "../../common/three/AnimatedSphere";
import { Sphere, TransformControls } from "@react-three/drei";
import { Mesh } from "three";
import round from "../../../utils/interpolation/round";
import { useChain, useSpringRef } from "@react-spring/three";
import Line from "../../common/three/Line";

const Wing3D = () => {
  const wing = useWingStore();
  const [active, setActive] = useState<Mesh>(null!);
  const leadingTip = useRef<Mesh>(null);
  const trailingTip = useRef<Mesh>(null);
  const trailingFuselage = useRef<Mesh>(null);

  const SCALE = 0.25;

  const getXTip = useCallback(
    () => (Math.tan((wing.angle * Math.PI) / 180) * wing.span) / 2,
    [wing.span, wing.angle]
  );

  const updateWing = ({ chord, chordTip, span, angle }: WingState) => {
    if (leadingTip.current && trailingTip.current && trailingFuselage.current) {
      const xTip = (Math.tan((angle * Math.PI) / 180) * span) / 2;

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

  const springRef = useSpringRef();

  useChain([springRef]);
  const trace = useMemo(() => {
    const xTip = getXTip();
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

  return (
    <>
      <gridHelper rotation-x={Math.PI / 2} />
      <TransformControls
        position={[1, 1, 1]}
        size={0.75}
        showZ={false}
        mode="translate"
        onChange={(e) => {
          const obj = e?.target.object;
          if (obj) {
            const { isTip, isTrailing, isFuselage } = obj.userData;
            const { x, y } = obj.position;

            if (isTip) {
              useWingStore.setState({ span: round(y * 2, 0.1) });
              if (isTrailing) {
                const angle = useWingStore.getState().angle;
                const span = useWingStore.getState().span;
                const oldChord = useWingStore.getState().chordTip;
                const xTip = (Math.tan((angle * Math.PI) / 180) * span) / 2;

                useWingStore.setState({ chordTip: round(x - xTip, 0.1) });
              }
            } else if (isFuselage) {
              useWingStore.setState({ chord: round(x, 0.1) });
            }
          }
        }}
        object={active}
      />
      <Sphere
        ref={trailingTip}
        userData={{ isTip: true, isTrailing: true }}
        onClick={(e) => setActive(e.object)}
        position={[0, 0, 0]}
        scale={[SCALE, SCALE, SCALE]}
        material-color={"green"}
      />
      <Sphere
        ref={leadingTip}
        userData={{ isTip: true }}
        onClick={(e) => setActive(e.object)}
        position={[0, 0, 0]}
        scale={[SCALE, SCALE, SCALE]}
        material-color={"red"}
      />
      <Sphere
        ref={trailingFuselage}
        userData={{ isFuselage: true }}
        onClick={(e) => setActive(e.object)}
        position={[0, 0, 0]}
        scale={[SCALE, SCALE, SCALE]}
        material-color={"red"}
      />
      <Line
        trace={trace}
        scale={[1, 1, 1]}
        color={"red"}
        springRef={springRef}
      />
    </>
  );
};

export default Wing3D;
