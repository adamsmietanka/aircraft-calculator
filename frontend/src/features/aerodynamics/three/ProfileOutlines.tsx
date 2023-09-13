import { animated, useSpring } from "@react-spring/three";
import useProfile from "../hooks/useProfile";
import { useWingStore } from "../stores/useWing";
import { getXTip } from "./hooks/useWingSprings";
import Line from "../../common/three/Line";

const ProfileOutlines = () => {
  const chordTip = useWingStore((state) => state.chordTip);
  const angle = useWingStore((state) => state.angle);
  const span = useWingStore((state) => state.span);

  const { profilePoints } = useProfile();

  const [profileSpring] = useSpring(
    () => ({
      positionX: getXTip(angle, span),
      positionY: span / 2,
      scale: chordTip,
    }),
    [span, angle, chordTip]
  );

  return (
    <>
      <animated.mesh
        position-x={profileSpring.positionX}
        position-y={profileSpring.positionY}
        rotation-x={Math.PI / 2}
        scale={profileSpring.scale}
      >
        <Line
          trace={{ name: "Outline", points: profilePoints }}
          scale={[1, 1, 1]}
        />
      </animated.mesh>
      <animated.mesh
        position-x={profileSpring.positionX}
        position-y={profileSpring.positionY.to((y) => -y)}
        rotation-x={Math.PI / 2}
        scale={profileSpring.scale}
      >
        <Line
          trace={{ name: "Outline", points: profilePoints }}
          scale={[1, 1, 1]}
        />
      </animated.mesh>
    </>
  );
};

export default ProfileOutlines;
