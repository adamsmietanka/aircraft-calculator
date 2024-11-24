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
        <p className="text-xl"></p>
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
        <div className="flex text-xl">
          {prof.M !== 0 && <p>0.0</p>}
          <p className="text-error">{prof.M * 100}</p>
        </div>
      </AnimatedInputTechnical>
      <AnimatedInputTechnical
        visible={hover.X}
        distance={-1.25}
        value={prof.P}
        valueY={prof.M}
        opacity={0.75}
      >
        <div className="flex text-xl">
          {prof.P !== 0 && <p>0.</p>}
          <p className="text-error">{prof.P * 10}</p>
        </div>
      </AnimatedInputTechnical>
      <AnimatedInputTechnical
        visible={hover.P}
        distance={-1.25}
        value={prof.P}
        valueY={prof.M}
        opacity={0.75}
      >
        <div className="flex text-xl text-primary">{prof.P}</div>
      </AnimatedInputTechnical>

      <mesh position={[0.5, -0.4, 0]}>
        <AnimatedHtml show={hover.P && prof.name.length === 5}>
          <div
            className={`flex text-xl font-['Computer_Modern']`}
          >
            <p>
              X<sub>C</sub>
            </p>
            <p className="mx-2">=</p>
            <p className="text-primary">{prof.P}</p>
            <p className="mx-2">=</p>
            <p className="text-error">{prof.name[1]}</p>
            <p className="mx-1">×</p>
            <p>0.05</p>
          </div>
        </AnimatedHtml>
      </mesh>
    </>
  );
};

export default ProfileCamber;
