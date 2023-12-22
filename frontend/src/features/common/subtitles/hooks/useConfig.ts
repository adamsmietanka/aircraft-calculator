import { config, easings } from "@react-spring/three";
import { useAnimationStore } from "../stores/useAnimation";

const useConfig = () => {
  const slowdown = useAnimationStore((state) => state.slowdown);
  const duration = useAnimationStore((state) => state.duration);

  return {
    customConfig: slowdown
      ? {
          duration: duration * 1000,
          easing: easings.easeInOutQuad,
        }
      : config.default,
  };
};

export default useConfig;
