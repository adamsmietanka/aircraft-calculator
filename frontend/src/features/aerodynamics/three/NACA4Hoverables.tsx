import { useHoverProfileStore } from "../stores/useHoverProfile";
import useProfileCamber from "../hooks/useProfileCamber";
import HoverColor from "../../common/HoverColor";

const NACA4Hoverables = ({ onProfile = true }) => {
  const hoverOn = useHoverProfileStore((state) => state.hoverOn);
  const hoverOff = useHoverProfileStore((state) => state.hoverOff);
  const hover = useHoverProfileStore((state) => state.hover);
  const { M, P, T } = useProfileCamber();

  return (
    <div className="flex items-center text-4xl">
      <HoverColor
        hover={hover.Y}
        name="Maximum camber of the airfoil"
        onEnter={() => onProfile && hoverOn("Y")}
        onLeave={() => onProfile && hoverOff("Y")}
      >
        {M * 100}
      </HoverColor>
      <HoverColor
        hover={hover.X}
        name="Position of maximum camber"
        onEnter={() => onProfile && hoverOn("X")}
        onLeave={() => onProfile && hoverOff("X")}
      >
        {P * 10}
      </HoverColor>
      <HoverColor
        hover={hover.T}
        name="Maximum thickness of the airfoil"
        onEnter={() => onProfile && hoverOn("T")}
        onLeave={() => onProfile && hoverOff("T")}
      >
        {String(T * 100).padStart(2, "0")}
      </HoverColor>
    </div>
  );
};

export default NACA4Hoverables;
