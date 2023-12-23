import { animated, easings, useSpring } from "@react-spring/web";
import Formula from "../../../common/Formula";
import { useEffect } from "react";
import { useMisconceptionStore } from "./stores/useMisconception";

const IntroMisconception = () => {
  const show = useMisconceptionStore((state) => state.show);
  const swap = useMisconceptionStore((state) => state.swap);
  const constant = useMisconceptionStore((state) => state.constant);
  const bigger = useMisconceptionStore((state) => state.bigger);
  const error = useMisconceptionStore((state) => state.error);

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

  const initial = {
    widthV: "32px",
    fontV: "2.25rem",
    leftV: "0px",
    topV: "0px",
    // time
    widthT: "0px",
    fontT: "1.5rem",
    rightT: "25px",
    topT: "20px",
    // distance
    fontD: "1.5rem",
    rightD: "26px",
    bottomD: "15px",
    // constant
    opacityC: 0,
    fontC: "0.1rem",
    // fraction
    fontF: "2.25rem",
    // cross/error
    opacityE: 0,
    // fontE: "0.1rem",
    leftE: "-11px",
    topE: "-20px",
    delay: 1000,
    config: {
      duration: 1000,
      easing: easings.easeInOutQuad,
    },
  };

  const [spring, api] = useSpring(() => initial, [show]);

  useEffect(() => {
    swap &&
      api.start({
        fontV: "1.5rem",
        leftV: "96px",
        topV: "17px",
        // time
        widthT: "15px",
        fontT: "2.25rem",
        rightT: "114px",
        topT: "0px",
        // distance
        rightD: "42px",
      });
  }, [swap]);

  useEffect(() => {
    constant &&
      api.start({
        widthV: "0px",
        leftV: "64px",
        fontT: "0rem",
        // constant
        opacityC: 1,
        fontC: "2.25rem",
      });
  }, [constant]);

  useEffect(() => {
    bigger &&
      api.start({
        fontV: "2.25rem",
        leftV: "69px",
        topV: "25px",
        // distance
        fontD: "2.25rem",
        rightD: "56px",
        bottomD: "23px",
        // fraction
        fontF: "3.375rem",
      });
  }, [bigger]);

  useEffect(() => {
    error && api.start({ opacityE: 1 });
  }, [error]);

  return (
    <animated.div
      className="fixed w-full h-full flex justify-center items-center translate-y-1/4 text-4xl"
      style={eqn}
    >
      <div className="relative">
        <Formula
          className="absolute z-10"
          style={{
            opacity: spring.opacityE,
            // fontSize: spring.fontE,
            left: spring.leftE,
            top: spring.topE,
          }}
          tex="\cancel{\phantom {constant}} \vphantom{ = \frac {d} {t} } "
        />
      </div>
      <Formula
        className="relative"
        style={{ opacity: spring.opacityC, fontSize: spring.fontC }}
        tex="constant \vphantom{ = \frac {d} {t} } "
      />
      <Formula
        className="relative"
        style={{
          width: spring.widthV,
          fontSize: spring.fontV,
          left: spring.leftV,
          top: spring.topV,
        }}
        tex="V \vphantom{ = \frac {d} {t} } "
      />
      <Formula tex="\vphantom{ V } = \vphantom{ \frac {d} {V} }" />
      <Formula
        style={{ fontSize: spring.fontF }}
        tex="\vphantom{ V =} \frac {\phantom d} {\phantom V}"
      />
      <Formula
        className="relative"
        style={{
          width: spring.widthT,
          fontSize: spring.fontT,
          right: spring.rightT,
          top: spring.topT,
        }}
        tex="t \vphantom{ = \frac {d} {t} }"
      />
      <Formula
        className="relative"
        style={{
          fontSize: spring.fontD,
          right: spring.rightD,
          bottom: spring.bottomD,
        }}
        tex="d"
      />
    </animated.div>
  );
};

export default IntroMisconception;
