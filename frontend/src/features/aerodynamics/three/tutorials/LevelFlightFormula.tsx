import { animated, easings, useSpring } from "@react-spring/web";
import Formula from "../../../common/Formula";
import { useEffect } from "react";
import { useLevelFlightStore } from "./stores/useLevelFlight";

const LevelFlightFormula = () => {
  const show = useLevelFlightStore((state) => state.show);
  const expand = useLevelFlightStore((state) => state.expand);
  const rearrange = useLevelFlightStore((state) => state.rearrange);

  const [eqn] = useSpring(
    () => ({
      from: {
        opacity: 0,
        display: "none",
      },
      to: async (next) => {
        show && (await next({ display: "flex" }));
        await next({ opacity: show ? 1 : 0 });
        show || (await next({ display: "none" }));
      },
    }),
    [show]
  );
  const [spring, api] = useSpring(
    () => ({
      opacity: 0,
      widthWL: "3rem",
      fontWL: "2.25rem",
      opacityWL: 1,
      widthMg: "0px",
      widthRho: "0px",
      opacityExpand: 0,
      // rho V^2 S
      fontRho: "1rem",
      rightRho: "0px",
      topRho: "0px",
      //fractions
      fracBiggerOpacity: 0,
      fracBigger: "0px",
      fracSmallerOpacity: 0,
      fracSmaller: "0px",
      // number two
      fontTwo: "0.1rem",
      topTwo: "16px",
      leftTwo: "9px",
      // m g
      fontMG: "0.1rem",
      topMG: "0px",
      leftMG: "0px",
      // CL
      widthCL: "0px",
      rightCL: "0px",
      colorCL: "oklch(var(--bc))",
    }),
    [show]
  );

  useEffect(() => {
    if (expand) {
      api.start({
        widthWL: "0rem",
        fontWL: "0rem",
        opacityWL: 0,
        fontMG: "2.25rem",
        widthMg: "56px",
        fontTwo: "1.5rem",
        widthRho: "102px",
        fontRho: "2.25rem",
        opacityExpand: 1,
        fracSmallerOpacity: 1,
        fracSmaller: "33px",
        widthCL: "53px",
        config: {
          duration: 1000,
          easing: easings.easeInOutQuad,
        },
      });
    }
  }, [expand]);

  useEffect(() => {
    if (rearrange) {
      api.start({
        widthRho: "0px",
        fontRho: "1.5rem",
        rightRho: "78px",
        topRho: "16px",
        // fractions
        fracBigger: "90px",
        fracBiggerOpacity: 1,
        fracSmallerOpacity: 0,
        fracSmaller: "0px",
        // number Two
        topTwo: "-21px",
        leftTwo: "18px",
        // mg
        fontMG: "1.5rem",
        topMG: "-19px",
        leftMG: "121px",
        // CL
        widthCL: "0px",
        rightCL: "194px",
        colorCL: "oklch(var(--p))",
        config: {
          duration: 1500,
          easing: easings.easeInOutQuad,
        },
      });
    }
  }, [rearrange]);

  return (
    <animated.div
      className="fixed w-full h-full flex justify-center items-center translate-y-1/4 text-4xl"
      style={eqn}
    >
      <Formula
        className="text-error"
        style={{ opacity: spring.opacityWL, fontSize: spring.fontWL }}
        tex="W"
      />
      <Formula
        className="relative"
        style={{
          opacity: spring.opacityExpand,
          // width: spring.widthMg,
          fontSize: spring.fontMG,
          left: spring.leftMG,
          top: spring.topMG,
        }}
        tex="mg \vphantom{= \frac{1}{2}}"
      />
      <Formula tex="\: = \:" />
      <Formula
        className="text-primary"
        style={{ opacity: spring.opacityWL, fontSize: spring.fontWL }}
        tex="L"
      />
      <Formula
        className="relative text-2xl w-0"
        style={{
          opacity: spring.opacityExpand,
          left: spring.leftTwo,
          top: spring.topTwo,
        }}
        tex="2"
      />
      <Formula
        style={{
          opacity: spring.fracSmallerOpacity,
          width: spring.fracSmaller,
        }}
        tex="\frac{1}{\phantom 2}"
      />
      <Formula
        style={{
          opacity: spring.fracBiggerOpacity,
          width: spring.fracBigger,
        }}
        tex="\frac {\phantom {2mg}} {\phantom {\rho V^2 S}  }"
      />
      <Formula
        className="relative"
        style={{
          opacity: spring.opacityExpand,
          width: spring.widthRho,
          fontSize: spring.fontRho,
          right: spring.rightRho,
          top: spring.topRho,
        }}
        tex="\rho V^2 S \vphantom {C_L}"
      />
      <Formula
        className="relative"
        style={{
          opacity: spring.opacityExpand,
          width: spring.widthCL,
          right: spring.rightCL,
          color: spring.colorCL,
        }}
        tex="\vphantom{ \rho V^2 S } C_L"
      />
    </animated.div>
  );
};

export default LevelFlightFormula;
