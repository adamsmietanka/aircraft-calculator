import HoverableFormulaColor from "../../common/HoverableFormulaColor";
import { useHoverProfileStore } from "../stores/useHoverProfile";
import useProfileCamber from "../hooks/useProfileCamber";

/**
 * Used to align latex symbols with surroundings
 * @param inside the text to be hidden
 * @returns text wrapped with vphantom
 */
const phantom = (inside: string) => `\\vphantom{${inside}}`;

const NACA4Hoverables = ({ onProfile = true }) => {
  const hoverOn = useHoverProfileStore((state) => state.hoverOn);
  const hoverOff = useHoverProfileStore((state) => state.hoverOff);
  const hover = useHoverProfileStore((state) => state.hover);

  const { M, P, T } = useProfileCamber();

  const first = `${M * 100}`;
  const second = `${P * 10}`;
  const third = `${String(T * 100).padStart(2, "0")}`;

  return (
    <div className="flex text-3xl">
      <HoverableFormulaColor
        name="Maximum camber of the airfoil"
        tex={first + phantom(second + third)}
        hover={hover.Y}
        onEnter={() => onProfile && hoverOn("Y")}
        onLeave={() => onProfile && hoverOff("Y")}
      />
      <HoverableFormulaColor
        name="Position of maximum camber"
        tex={phantom(first) + second + phantom(third)}
        hover={hover.X}
        onEnter={() => onProfile && hoverOn("X")}
        onLeave={() => onProfile && hoverOff("X")}
      />
      <HoverableFormulaColor
        name="Maximum thickness of the airfoil"
        tex={phantom(first + second) + third}
        hover={hover.T}
        onEnter={() => onProfile && hoverOn("T")}
        onLeave={() => onProfile && hoverOff("T")}
      />
    </div>
  );
};

export default NACA4Hoverables;
