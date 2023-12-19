import { animated, easings, useSpring } from "@react-spring/web";
import Formula from "../../../common/Formula";
import { useNewtonStore } from "./stores/useNewton";

const IntroNewton2nd = () => {
  const show = useNewtonStore((state) => state.show);
  const velocity = useNewtonStore((state) => state.velocity);
  const acceleration = useNewtonStore((state) => state.acceleration);
  const force = useNewtonStore((state) => state.force);

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
      fontV: velocity ? "2.25rem" : "0rem",
      opacityV: velocity ? 1 : 0,
      fontF: force ? "2.25rem" : "0rem",
      opacityF: force ? 1 : 0,
      fontA: acceleration ? "2.25rem" : "0rem",
      opacityA: acceleration ? 1 : 0,
      config: {
        duration: 1000,
        easing: easings.easeInOutQuad,
      },
    }),
    [show, force, velocity, acceleration]
  );

  return (
    <animated.div
      className="fixed w-full h-full flex justify-center items-center translate-y-1/4 text-4xl"
      style={eqn}
    >
      <Formula
        style={{ opacity: spring.opacityF, fontSize: spring.fontF }}
        tex="\vec{F} = m"
      />
      <Formula
        style={{ opacity: spring.opacityV, fontSize: spring.fontV }}
        tex="\vphantom {\vec{F} = m} \, \frac {d \vec{V} } {dt}"
      />
      <Formula
        style={{ opacity: spring.opacityA, fontSize: spring.fontA }}
        tex="\vphantom {\vec{F} = m} \, \vec{a}"
      />
    </animated.div>
  );
};

export default IntroNewton2nd;
