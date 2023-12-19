import { animated, to, useSpring } from "@react-spring/three";
import { useInducedDragStore } from "./stores/useInducedDrag";
import { Props } from "../../../common/types/three";
import { useEffect } from "react";
import AnimatedLine from "../../../common/three/AnimatedLine";
import ProfileAirstreams from "../ProfileAirstreams";
import { useWingStore } from "../../stores/useWing";
import { useLocation } from "react-router-dom";
import { useProfileChartsStore } from "../../hooks/useProfileCharts";
import useProfileTable, { Row } from "../../hooks/useProfileTable";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import useInduced from "./hooks/useInduced";

const InducedDragSpan = ({ opacity }: Props) => {
  const show = useInducedDragStore((state) => state.span);
  const airstreamOpacity = useInducedDragStore(
    (state) => state.airstreamOpacity
  );
  const profile = useWingStore((state) => state.profile);
  const { maxCz } = useProfileTable(1, profile) as Row;
  const { spanwise } = useInduced();

  const reynolds = useWingStore((state) => state.reynolds);
  const { pathname } = useLocation();
  const setChart = useProfileChartsStore((state) => state.set);
  const chart = useProfileChartsStore();
  const mass = useHoverProfileStore((state) => state.mass);

  const speed = reynolds / 6;
  const spanWiseSpeed = 0.2 * chart.yHover * speed;

  useEffect(() => {
    if (pathname === "/aerodynamics/inducedDrag") {
      setChart({ yHover: Math.min(maxCz, mass / (speed * speed)) });
    }
  }, [mass, speed, spanWiseSpeed]);

  const [spring, api] = useSpring(
    () => ({
      from: { opacity: 0, visible: false, airstreamOpacity: 0 },
      to: async (next) => {
        show && (await next({ visible: true }));
        await next({ opacity: show ? 1 : 0 });
        show || (await next({ visible: false }));
      },
    }),
    [show]
  );

  useEffect(() => {
    api.start({ airstreamOpacity });
  }, [airstreamOpacity]);
  return (
    <>
      <animated.mesh visible={spring.visible}>
        <AnimatedLine
          points={spanwise}
          style="dotted"
          color="grid"
          offset={spanWiseSpeed}
          opacity={to([opacity, spring.opacity], (o, opacity) => o * opacity)}
        />
      </animated.mesh>
      <mesh position-z={0.95}>
        <ProfileAirstreams opacity={spring.airstreamOpacity} show={true} />
      </mesh>
    </>
  );
};

export default InducedDragSpan;
