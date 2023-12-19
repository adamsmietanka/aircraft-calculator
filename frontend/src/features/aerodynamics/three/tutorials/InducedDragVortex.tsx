import { animated, to, useSpring } from "@react-spring/three";
import { useInducedDragStore } from "./stores/useInducedDrag";
import { Props } from "../../../common/types/three";
import { useEffect } from "react";
import AnimatedLine from "../../../common/three/AnimatedLine";
import { useWingStore } from "../../stores/useWing";
import { useProfileChartsStore } from "../../hooks/useProfileCharts";
import useInduced from "./hooks/useInduced";
import useProfileVisualizer from "../hooks/useProfileVisualizer";

const InducedDragVortex = ({ opacity }: Props) => {
  const show = useInducedDragStore((state) => state.vortex);
  const { vortex } = useInduced();

  const reynolds = useWingStore((state) => state.reynolds);
  const chart = useProfileChartsStore();

  const { profileSpring } = useProfileVisualizer();

  const speed = reynolds / 6;
  const spanWiseSpeed = 0.2 * chart.yHover * speed;
  const vortexSpeed =
    5 * Math.sqrt(spanWiseSpeed * spanWiseSpeed + 0.01 * speed * speed);

  const [spring, api] = useSpring(
    () => ({
      from: { opacity: 0, visible: false, speed: 1 },
      to: async (next) => {
        show && (await next({ visible: true }));
        await next({ opacity: show ? 1 : 0 });
        show || (await next({ visible: false }));
      },
    }),
    [show]
  );

  useEffect(() => {
    api.start({ speed });
  }, [speed]);

  return (
    <animated.mesh position-x={0.25} position-z={1} visible={spring.visible}>
      <animated.mesh
        scale-x={spring.speed}
        rotation-z={profileSpring.angle.to((a) => -a - (3 * Math.PI) / 180)}
      >
        <AnimatedLine
          points={vortex}
          style="vortex"
          color="grid"
          offset={vortexSpeed}
          opacity={to([opacity, spring.opacity], (o, opacity) => o * opacity)}
        />
        <mesh rotation-x={Math.PI}>
          <AnimatedLine
            points={vortex}
            style="vortex"
            color="grid"
            offset={vortexSpeed}
            opacity={to([opacity, spring.opacity], (o, opacity) => o * opacity)}
          />
        </mesh>
      </animated.mesh>
    </animated.mesh>
  );
};

export default InducedDragVortex;
