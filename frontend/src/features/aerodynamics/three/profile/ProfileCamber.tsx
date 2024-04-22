import AnimatedInputTechnical from "../../../common/drawings/AnimatedInputTechnical";
import useWingScale from "../../hooks/useWingScale";
import { useProfileStore } from "../../stores/useProfile";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import Formula from "../../../common/Formula";
import AnimatedHtml from "../../../common/three/AnimatedHtml";

const ProfileCamber = () => {
  const { scaleProfile } = useWingScale();
  const hover = useHoverProfileStore((state) => state.hover);

  const prof = useProfileStore((state) => state.prof);
  return (
    <>
      <AnimatedInputTechnical
        scale={scaleProfile}
        visible={hover.Y || hover.X || hover.P}
        distance={-2}
        value={1}
        opacity={0.75}
      >
        <Formula
          className={`text-xl ${hover.Y || hover.X || hover.P || "hidden"}`}
          tex="1"
        />
      </AnimatedInputTechnical>
      <AnimatedInputTechnical
        visible={hover.Y}
        scale={scaleProfile}
        distance={0.25}
        value={prof.M}
        valueY={-prof.P}
        opacity={0.75}
        vertical
      >
        <div className={`flex text-xl ${hover.Y || "hidden"}`}>
          <Formula className={`${prof.M === 0 && "hidden"}`} tex="0.0" />
          <Formula className="text-error" tex={`${prof.M * 100}`} />
        </div>
      </AnimatedInputTechnical>
      <AnimatedInputTechnical
        visible={hover.X}
        distance={-1.25}
        value={prof.P}
        valueY={prof.M}
        opacity={0.75}
      >
        <div className={`flex text-xl ${hover.X || "hidden"}`}>
          <Formula className={`${prof.P === 0 && "hidden"}`} tex="0." />
          <Formula className="text-error" tex={`${prof.P * 10}`} />
        </div>
      </AnimatedInputTechnical>
      <AnimatedInputTechnical
        visible={hover.P}
        distance={-1.25}
        value={prof.P}
        valueY={prof.M}
        opacity={0.75}
      >
        <div className={`flex text-xl ${hover.P || "hidden"}`}>
          <Formula className="text-primary" tex={`${prof.P}`} />
        </div>
      </AnimatedInputTechnical>

      <mesh position={[0.5, -0.4, 0]}>
        <AnimatedHtml show={hover.P && prof.name.length === 5}>
          <div className={`flex text-xl ${hover.P || "hidden"}`}>
            <Formula tex="X_C =" />
            <Formula
              className="text-primary"
              tex={`\\, ${prof.P}`}
              phantom="X_C"
            />
            <Formula tex="= \," phantom="X_C" />
            <Formula
              className="text-error"
              tex={`\\, ${prof.name[1]}`}
              phantom="X_C"
            />
            <Formula tex="*0.05 " phantom="X_C" />
          </div>
        </AnimatedHtml>
      </mesh>
    </>
  );
};

export default ProfileCamber;
