import { animated, useSpring } from "@react-spring/three";
import useProfile from "../hooks/useProfile";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../common/three/config";
import { useProfileChartsStore } from "../hooks/useProfileCharts";
import { useWingStore } from "../stores/useWing";
import { getXTip } from "./hooks/useWingSprings";
import Line from "../../common/three/Line";
import { useLocation } from "react-router-dom";

interface Props {
  size: number[];
  gridPositionX: number;
}

const ProfileOutline = ({ size, gridPositionX }: Props) => {
  const x = useProfileChartsStore((state) => state.x);
  const hover = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);

  const chord = useWingStore((state) => state.chord);
  const chordTip = useWingStore((state) => state.chordTip);
  const angle = useWingStore((state) => state.angle);
  const span = useWingStore((state) => state.span);

  const { profilePoints, chordPoints, yCamber } = useProfile();

  const location = useLocation();

  const outlineNormal =
    location.pathname === "/aerodynamics/profile" || location.pathname === "/";

  const rotateProfile =
    location.pathname === "/aerodynamics/profile" &&
    (!!locked || hover["Coefficient of Lift"] || hover["Coefficient of Drag"]);


  const localWidth = CANVAS_WIDTH * size[0];
  const localHeight = CANVAS_HEIGHT * size[1];

  const [profileSpring] = useSpring(
    () => ({
      aoa: rotateProfile ? (-x["Coefficient of Lift"] * Math.PI) / 180 : 0,
      x: outlineNormal ? -0.25 : 0,
      y: outlineNormal ? -yCamber : 0,
      scale: outlineNormal
        ? 0.96 * localWidth
        : Math.min(
            localHeight / span,
            (0.5 * localWidth) / (getXTip(angle, span) + chordTip),
            (0.5 * localWidth) / chord
          ) * chord,
    }),
    [outlineNormal, chord, span, angle, chordTip, yCamber, x, rotateProfile]
  );

  return (
    <animated.mesh
      position-x={(gridPositionX * size[0] * CANVAS_WIDTH) / 2}
      rotation-z={profileSpring.aoa}
      scale={profileSpring.scale}
    >
      <animated.mesh position-x={profileSpring.x} position-y={profileSpring.y}>
        <Line
          trace={{ name: "Outline", points: profilePoints }}
          scale={[1, 1, 1]}
        />
        <Line
          trace={{ name: "Chord", points: chordPoints }}
          scale={[1, 1, 1]}
          width={1.5}
          color="secondary"
        />
      </animated.mesh>
    </animated.mesh>
  );
};

export default ProfileOutline;
