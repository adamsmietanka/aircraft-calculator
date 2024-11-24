import HoverColor from "../../common/HoverColor";
import { useHoverProfileStore } from "../stores/useHoverProfile";
import { useProfileStore } from "../stores/useProfile";

const NACA4Hoverables = ({ onProfile = true }) => {
  const hoverOn = useHoverProfileStore((state) => state.hoverOn);
  const hoverOff = useHoverProfileStore((state) => state.hoverOff);
  const hover = useHoverProfileStore((state) => state.hover);

  const prof = useProfileStore((state) => state.prof);

  return (
    <div className="flex text-3xl">
      <HoverColor
        hover={hover.L}
        name="Optimal lift coefficient"
        onEnter={() => onProfile && hoverOn("L")}
        onLeave={() => onProfile && hoverOff("L")}
      >
        {prof.name[0]}
      </HoverColor>
      <HoverColor
        hover={hover.P}
        name="Position of maximum camber"
        onEnter={() => onProfile && hoverOn("P")}
        onLeave={() => onProfile && hoverOff("P")}
      >
        {prof.name[1]}
      </HoverColor>
      <HoverColor
        hover={hover.S}
        name="Airfoil trailing edge shape"
        onEnter={() => onProfile && hoverOn("S")}
        onLeave={() => onProfile && hoverOff("S")}
      >
        {prof.name[2]}
      </HoverColor>
      <HoverColor
        hover={hover.T}
        name="Maximum thickness of the airfoil"
        onEnter={() => onProfile && hoverOn("T")}
        onLeave={() => onProfile && hoverOff("T")}
      >
        {String(prof.T * 100).padStart(2, "0")}
      </HoverColor>
    </div>
  );
};

export default NACA4Hoverables;
