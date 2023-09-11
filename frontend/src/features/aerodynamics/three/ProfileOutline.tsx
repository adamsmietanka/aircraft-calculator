import { animated, useSpring } from "@react-spring/three";
import useProfile from "../hooks/useProfile";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../../common/three/config";
import { useProfileChartsStore } from "../hooks/useProfileCharts";
import { useWingStore } from "../stores/useWing";
import { getXTip } from "./hooks/useWingSprings";
import Line from "../../common/three/Line";

interface Props {
  size: number[];
  gridPositionX: number;
}

const ProfileOutline = ({ size, gridPositionX }: Props) => {
  const x = useProfileChartsStore((state) => state.x);
  const y = useProfileChartsStore((state) => state.y);
  const hover = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);

  const chord = useWingStore((state) => state.chord);
  const chordTip = useWingStore((state) => state.chordTip);
  const angle = useWingStore((state) => state.angle);
  const span = useWingStore((state) => state.span);

  const { profilePoints } = useProfile();

  const rotateProfile =
    location.pathname === "/aerodynamics/profile" &&
    (!!locked || hover["Coefficient of Lift"] || hover["Coefficient of Drag"]);

  const [rotationSpring] = useSpring(
    () => ({
      x: rotateProfile ? x["Coefficient of Lift"] : 0,
    }),
    [x, y, hover, locked, rotateProfile]
  );

  const localWidth = CANVAS_WIDTH * size[0];
  const localHeight = CANVAS_HEIGHT * size[1];

  const [stepSpring] = useSpring(
    () => ({
      profileX:
        location.pathname === "/aerodynamics/profile"
          ? -0.25 * 0.96 * localWidth
          : 0,
      scale:
        location.pathname === "/aerodynamics/profile"
          ? 0.96 * localWidth
          : Math.min(
              localHeight / span,
              (0.5 * localWidth) / (getXTip(angle, span) + chordTip),
              (0.5 * localWidth) / chord
            ) * chord,
    }),
    [location.pathname]
  );

  return (
    <animated.mesh position-x={(gridPositionX * size[0] * CANVAS_WIDTH) / 2}>
      <animated.mesh
        rotation-z={rotationSpring.x.to((x) => (-x * Math.PI) / 180)}
      >
        <animated.mesh
          position-x={stepSpring.profileX.to((x) => x)}
          scale={stepSpring.scale}
        >
          <Line
            trace={{ name: "Outline", points: profilePoints }}
            scale={[1, 1, 1]}
          />
        </animated.mesh>
      </animated.mesh>
    </animated.mesh>
  );
};

export default ProfileOutline;
