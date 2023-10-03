import Vector from "./Vector";
import { useProfileChartsStore } from "../hooks/useProfileCharts";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import { SpringValue, useSpring } from "@react-spring/three";
import { useLocation } from "react-router-dom";
import { useHoverProfileStore } from "../stores/useHoverProfile";
import Formula from "../../common/Formula";

interface Props {
  opacity: SpringValue<number>;
}

const ProfileVectors = ({ opacity }: Props) => {
  const x = useProfileChartsStore((state) => state.x);
  const y = useProfileChartsStore((state) => state.y);
  const hover = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);

  const set = useHoverProfileStore((state) => state.set);
  const splitVectors = useHoverProfileStore((state) => state.splitVectors);
  const dragMultiplier = useHoverProfileStore((state) => state.dragMultiplier);

  const location = useLocation();

  const show =
    (location.pathname === "/aerodynamics/profile" && !!locked) ||
    hover["Coefficient of Lift"] ||
    hover["Coefficient of Drag"];

  const cl = y["Coefficient of Lift"];
  const cd = dragMultiplier * x["Coefficient of Drag"];

  const [vectorsSpring] = useSpring(
    () => ({
      zero: 0,
      rotationLift: splitVectors ? 0 : -Math.atan(cd / cl),
      rotationDrag: splitVectors
        ? -Math.PI / 2
        : -Math.atan(cd / cl) + (Math.sign(cl) === -1 ? Math.PI : 0),
    }),
    [splitVectors, x, y]
  );
  return (
    <>
      <Vector
        value={
          splitVectors
            ? cl
            : Math.sqrt(cd * cd + cl * cl) * (Math.sign(cl) === -1 ? -1 : 1)
        }
        rotation={vectorsSpring.rotationLift}
        show={(!splitVectors || cl !== 0) && show}
        opacity={opacity}
        color="primary"
      >
        <Formula
          className={`text-xl text-primary ${splitVectors && "hidden"}`}
          tex={`F`}
        />
        <div className={`${splitVectors || "hidden"}`}>
          <HoverableFormulaSimple
            name="Lift"
            tex={`F_L`}
            texHover={`F_L=\\frac{1}{2} \\rho V^2 S C_L`}
          />
        </div>
      </Vector>
      <Vector
        value={cd}
        otherValue={cl}
        rotation={vectorsSpring.rotationDrag}
        show={splitVectors && show}
        opacity={opacity}
        color="error"
      >
        <HoverableFormulaSimple
          name="Drag"
          tex={`F_D`}
          texHover={` F_D=\\frac{1}{2} \\rho V^2 SC_D`}
        />
      </Vector>
    </>
  );
};

export default ProfileVectors;
