import { animated, useSpring } from "@react-spring/web";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import Formula from "../../../common/Formula";
import { useEffect } from "react";

const IntroMisconception = () => {
  const show = useHoverProfileStore((state) => state.misconception);
  const swap = useHoverProfileStore((state) => state.misconceptionSwap);
  const showConst = useHoverProfileStore((state) => state.misconceptionConst);
  const bigger = useHoverProfileStore((state) => state.misconceptionBigger);
  const error = useHoverProfileStore((state) => state.misconceptionError);

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

  const [constant] = useSpring(
    () => ({
      from: {
        marginRight: "-20px",
      },
      to: async (next) => {
        showConst && next({ width: "10rem" });
        await next({ opacity: showConst ? 1 : 0 });
        showConst || (await next({ width: "0rem" }));
      },
    }),
    [showConst]
  );

  const [cross] = useSpring(
    () => ({
      from: {
        position: "absolute",
        left: "-0.5rem",
        top: "-1.5rem",
      },
      to: async (next) => {
        error && next({ width: "10rem" });
        await next({ opacity: error ? 1 : 0 });
        error || (await next({ width: "0rem" }));
      },
    }),
    [error]
  );

  const [V, vApi] = useSpring(
    () => ({
      position: "relative",
      width: "1.5rem",
      left: swap ? "82px" : "0px",
      top: swap ? "20px" : "0px",
      fontSize: swap ? "1.5rem" : "2.25rem",
    }),
    [swap]
  );

  useEffect(() => {
    bigger && vApi.start({ fontSize: "2.25rem", top: "28px" });
  }, [bigger]);

  const [time, timeApi] = useSpring(
    () => ({
      position: "relative",
      width: "1rem",
      right: swap ? "105px" : "23px",
      top: swap ? "0px" : "20px",
      fontSize: swap ? "2.25rem" : "1.5rem",
    }),
    [swap]
  );

  useEffect(() => {
    showConst && timeApi.start({ fontSize: "0rem" });
  }, [showConst]);

  const [dist] = useSpring(
    () => ({
      position: "relative",
      right: "40px",
      bottom: bigger ? "23px" : "15px",
      fontSize: bigger ? "2.25rem" : "1.5rem",
    }),
    [bigger]
  );

  return (
    <animated.div
      className="fixed w-full h-full flex justify-center items-center translate-y-1/4 text-4xl"
      style={eqn}
    >
      <div className="relative">
        <Formula
          style={cross}
          tex="\cancel{\phantom {constant}} \vphantom{ = \frac {d} {t} } "
        />
      </div>
      <Formula style={constant} tex="constant \vphantom{ = \frac {d} {t} } " />
      <Formula style={V} tex="V \vphantom{ = \frac {d} {t} } " />
      <Formula tex="\vphantom{ V } = \frac {\phantom d} {\phantom t}" />
      <Formula style={time} tex="t \vphantom{ = \frac {d} {t} }" />
      <Formula style={dist} tex="d" />
    </animated.div>
  );
};

export default IntroMisconception;
