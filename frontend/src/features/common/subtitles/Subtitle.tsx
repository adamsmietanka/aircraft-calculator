import { useSubtitleStore } from "./stores/useSubtitles";

const Subtitle = () => {
  const subtitle = useSubtitleStore((state) => state.subtitle);
  const visible = useSubtitleStore((state) => state.visible);

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
