import { useAnimationStore } from "./stores/useAnimation";

const Subtitle = () => {
  const subtitle = useAnimationStore((state) => state.subtitle);
  const visible = useAnimationStore((state) => state.visible);

  return (
    <div
      className={`fixed w-full h-full flex justify-center items-center translate-y-1/3 text-2xl ${
        visible || "invisible"
      }`}
    >
      {subtitle}
    </div>
  );
};

export default Subtitle;
