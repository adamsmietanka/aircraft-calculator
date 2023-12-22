import { config, easings } from "@react-spring/three";
import { useSubtitleStore } from "../stores/useSubtitles";

const useConfig = () => {
  const slowdown = useSubtitleStore((state) => state.slowdown);
  const duration = useSubtitleStore((state) => state.duration);

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
