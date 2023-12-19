import { animated, easings, useSpring } from "@react-spring/web";
import Formula from "../../../common/Formula";
import { useBernoulliStore } from "./stores/useBernoulli";

const IntroBernoulli = () => {
  const show = useBernoulliStore((state) => state.show);
  const potential = useBernoulliStore((state) => state.potential);
  const speedUp = useBernoulliStore((state) => state.speedUp);

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
      fontPotential: potential ? "2.25rem" : "0rem",
      opacityPotential: potential ? 1 : 0,
      fontKinetic: speedUp ? "3rem" : "2rem",
      fontPressure: speedUp ? "1.25rem" : "2rem",
      config: {
        duration: 1000,
        easing: easings.easeInOutQuad,
      },
    }),
    [show, potential, speedUp]
  );

  return (
    <animated.div
      className="fixed w-full h-full flex justify-center items-center translate-y-1/4 text-4xl"
      style={eqn}
    >
      <Formula style={{ fontSize: spring.fontKinetic }} tex="\frac {V^2} {2}" />
      <Formula
        style={{
          fontSize: spring.fontPotential,
          opacity: spring.opacityPotential,
        }}
        tex="\: + \: gh"
      />
      <Formula tex="\: + \:" />
      <Formula
        className="mt-2"
        style={{ fontSize: spring.fontPressure }}
        tex="\frac {p} {\rho}"
      />
      <Formula tex="\: = constant" />
    </animated.div>
  );
};

export default IntroBernoulli;
