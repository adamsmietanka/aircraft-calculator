import { config, easings } from "@react-spring/three";
import { useSubtitleStore } from "../stores/useSubtitles";

const useConfig = () => {
  const slowdown = useSubtitleStore((state) => state.slowdown);

  return {
    customConfig: slowdown
      ? {
          duration: 2000,
          easing: easings.easeInOutQuad,
        }
      : config.default,
  };
};

export default useConfig;
