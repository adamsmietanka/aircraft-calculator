import Vector from "./Vector";
import { useProfileChartsStore } from "../hooks/useProfileCharts";
import HoverableFormulaSimple from "../../common/HoverableFormulaSimple";
import { SpringValue, useSpring } from "@react-spring/three";
import { useHoverProfileStore } from "../stores/useHoverProfile";
import Formula from "../../common/Formula";

interface Props {
  opacity: SpringValue<number>;
  show: boolean;
}

const ProfileVectors = ({ opacity, show }: Props) => {
  const x = useProfileChartsStore((state) => state.x);
  const y = useProfileChartsStore((state) => state.y);

  const showWeight = useHoverProfileStore((state) => state.showWeight);
  const splitVectors = useHoverProfileStore((state) => state.splitVectors);
  const dragMultiplier = useHoverProfileStore((state) => state.dragMultiplier);
  const vectorSize = useHoverProfileStore((state) => state.vectorSize);
  const mass = useHoverProfileStore((state) => state.mass);
  const speed = useHoverProfileStore((state) => state.speed);

  const cl = y["Coefficient of Lift"];
  const cd = dragMultiplier * x["Coefficient of Drag"];
  const lift = cl * speed * speed;
  const drag = cd * speed * speed;

  const [vectorsSpring] = useSpring(
    () => ({
      rotationWeight: Math.PI,
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
          (splitVectors
            ? lift
            : Math.sqrt(cd * cd + cl * cl) * (Math.sign(cl) === -1 ? -1 : 1)) *
          vectorSize
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
            tex={`L`}
            texHover={`L=\\frac{1}{2} \\rho V^2 S C_L`}
          />
        </div>
      </Vector>
      <Vector
        value={drag * vectorSize}
        otherValue={cl}
        rotation={vectorsSpring.rotationDrag}
        show={splitVectors && show}
        opacity={opacity}
        color="error"
      >
        <HoverableFormulaSimple
          name="Drag"
          tex={`D`}
          texHover={`D=\\frac{1}{2} \\rho V^2 SC_D`}
        />
      </Vector>
      <Vector
        value={mass * vectorSize}
        rotation={vectorsSpring.rotationWeight}
        show={showWeight && show}
        opacity={opacity}
        color="error"
      >
        <HoverableFormulaSimple name="Weight" tex={`W`} texHover={`W=mg`} />
      </Vector>
    </>
  );
};

export default ProfileVectors;
