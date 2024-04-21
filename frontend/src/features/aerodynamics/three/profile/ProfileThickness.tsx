import AnimatedInputTechnical from "../../../common/drawings/AnimatedInputTechnical";
import useWingScale from "../../hooks/useWingScale";
import { useProfileStore } from "../../stores/useProfile";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import Formula from "../../../common/Formula";
import AnimatedLine from "../../../common/three/AnimatedLine";

const ProfileThickness = () => {
  const { scaleProfile } = useWingScale();
  const hover = useHoverProfileStore((state) => state.hover);

  const prof = useProfileStore((state) => state.prof);
  return (
    <mesh visible={hover.T}>
      <mesh position-x={prof.F}>
        <AnimatedInputTechnical
          distance={-0.7 * scaleProfile - 0.6}
          value={prof.max[1].y - prof.max[0].y}
          startX={prof.max[0].y}
          opacity={0.75}
          vertical
        >
          <div className={`flex text-xl ${hover.T || "hidden"}`}>
            <Formula tex="0." />
            <Formula
              className="text-error"
              tex={`${String(prof.T * 100).padStart(2, "0")}`}
            />
          </div>
        </AnimatedInputTechnical>
        <AnimatedLine
          points={[
            [0, prof.max[0].y, 0],
            [0, prof.max[1].y, 0],
          ]}
          opacity={0.75}
          width={1.5}
          color="secondary"
          segments
        />
      </mesh>
      <AnimatedInputTechnical
        distance={-1.25}
        value={prof.F}
        valueY={prof.max[0].y}
        opacity={0.75}
      >
        <div className={`flex text-xl ${hover.T || "hidden"}`}>
          <Formula tex={`${prof.F}`} />
        </div>
      </AnimatedInputTechnical>
    </mesh>
  );
};

export default ProfileThickness;
