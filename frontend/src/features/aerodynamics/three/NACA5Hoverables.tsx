import HoverableFormulaColor from "../../common/HoverableFormulaColor";
import { useHoverProfileStore } from "../stores/useHoverProfile";
import { useProfileStore } from "../stores/useProfile";

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

  const prof = useProfileStore((state) => state.prof);

  const first = prof.name[0];
  const second = prof.name[1];
  const third = prof.name[2];
  const fourth = `${String(prof.T * 100).padStart(2, "0")}`;

  return (
    <div className="flex text-3xl">
      <HoverableFormulaColor
        name="Optimal lift coefficient"
        tex={first + phantom(second + third + fourth)}
        hover={hover.L}
        onEnter={() => onProfile && hoverOn("L")}
        onLeave={() => onProfile && hoverOff("L")}
      />
      <HoverableFormulaColor
        name="Position of maximum camber"
        tex={phantom(first) + second + phantom(third + fourth)}
        hover={hover.P}
        onEnter={() => onProfile && hoverOn("P")}
        onLeave={() => onProfile && hoverOff("P")}
      />
      <HoverableFormulaColor
        name="Airfoil trailing edge shape"
        tex={phantom(first + second) + third + phantom(fourth)}
        hover={hover.S}
        onEnter={() => onProfile && hoverOn("S")}
        onLeave={() => onProfile && hoverOff("S")}
      />
      <HoverableFormulaColor
        name="Maximum thickness of the airfoil"
        tex={phantom(first + second + third) + fourth}
        hover={hover.T}
        onEnter={() => onProfile && hoverOn("T")}
        onLeave={() => onProfile && hoverOff("T")}
      />
    </div>
  );
};

export default NACA4Hoverables;
