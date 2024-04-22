import AnimatedHtml from "../../../common/three/AnimatedHtml";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import Formula from "../../../common/Formula";
import { useProfileStore } from "../../stores/useProfile";
import { useEffect } from "react";
import { useProfileChartsStore } from "../../hooks/useProfileCharts";

const ProfileCl = () => {
  const hover = useHoverProfileStore((state) => state.hover);
  const prof = useProfileStore((state) => state.prof);

  const set = useProfileChartsStore((state) => state.set);

  useEffect(() => {
    if (hover.L) {
      //TODO: after hovering the x chart it won't update to Y
      set({ hover: true, yHover: prof.L });
      set({ yHover: prof.L });
      // workaround: force a Y update
    } else set({ hover: false, yHover: prof.L - 0.0001 });
  }, [hover.L]);
  return (
    <mesh position={[0.5, -0.2, 0]}>
      <AnimatedHtml show={hover.L}>
        <div className={`flex text-xl ${hover.L || "hidden"}`}>
          <Formula tex="C_L =" />
          <Formula
            className="text-primary"
            tex={`\\, ${prof.L}`}
            phantom="C_L"
          />
          <Formula tex="= \," phantom="C_L" />
          <Formula
            className="text-error"
            tex={`\\, ${prof.name[0]}`}
            phantom="C_L"
          />
          <Formula tex="*0.15 " phantom="C_L" />
        </div>
      </AnimatedHtml>
    </mesh>
  );
};

export default ProfileCl;
