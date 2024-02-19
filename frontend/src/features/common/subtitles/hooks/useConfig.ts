import { config, easings } from "@react-spring/three";
import { useAnimationStore } from "../stores/useAnimation";
import { useEffect, useState } from "react";

const useConfig = () => {
  const slowdown = useAnimationStore((state) => state.slowdown);
  const duration = useAnimationStore((state) => state.duration);

  const [customConfig, setCustomConfig] = useState<Record<string, any>>(
    config.default
  );

  useEffect(() => {
    setCustomConfig(
      slowdown
        ? {
            duration: duration * 1000,
            easing: easings.easeInOutQuad,
          }
        : config.default
    );
  }, [slowdown]);

  return {
    customConfig,
  };
};

export default useConfig;
