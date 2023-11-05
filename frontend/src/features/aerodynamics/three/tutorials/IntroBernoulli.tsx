import { animated, useSpring } from "@react-spring/web";
import { useEffect } from "react";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import Formula from "../../../common/Formula";

const IntroBernoulli = () => {
  const showBernoulli = useHoverProfileStore((state) => state.showBernoulli);
  const showBernoulliPotential = useHoverProfileStore(
    (state) => state.showBernoulliPotential
  );
  const showBernoulliDiff = useHoverProfileStore(
    (state) => state.showBernoulliDiff
  );

  const [eqn] = useSpring(
    () => ({
      from: {
        opacity: 0,
        display: "none",
      },
      to: async (next) => {
        showBernoulli && (await next({ display: "flex" }));
        await next({ opacity: showBernoulli ? 1 : 0 });
        showBernoulli || (await next({ display: "none" }));
      },
    }),
    [showBernoulli]
  );

  const [potential] = useSpring(
    () => ({
      from: {},
      to: async (next) => {
        showBernoulliPotential && next({ width: "3rem" });
        next({ opacity: showBernoulliPotential ? 1 : 0 });
        showBernoulliPotential || next({ width: "0rem", delay: 250 });
      },
    }),
    [showBernoulliPotential]
  );

  const [kinetic] = useSpring(
    () => ({
      "font-size": showBernoulliDiff ? "3rem" : "2rem",
    }),
    [showBernoulliDiff]
  );

  const [pressure] = useSpring(
    () => ({
      "font-size": showBernoulliDiff ? "1.25rem" : "2rem",
    }),
    [showBernoulliDiff]
  );

  return (
    <animated.div
      className="fixed w-full h-full flex justify-center items-center translate-y-1/4 text-4xl"
      style={eqn}
    >
      <Formula style={kinetic} tex={`\\frac{V^2}{2}`} />
      <Formula style={potential} tex={`\\:+\\:`} />
      <Formula style={potential} tex={`gh`} />
      <Formula tex={`\\:+\\:`} />
      <Formula className="mt-1" style={pressure} tex={`\\frac{p}{\\rho}`} />
      <Formula tex={`\\:=\\:`} />
      <Formula tex={`constant`} />
    </animated.div>
  );
};

export default IntroBernoulli;
