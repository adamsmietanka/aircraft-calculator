import { animated, useSpring } from "@react-spring/web";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import Formula from "../../../common/Formula";

const IntroNewton2nd = () => {
  const showNewton = useHoverProfileStore((state) => state.showNewton);
  const showNewtonVelocity = useHoverProfileStore(
    (state) => state.showNewtonVelocity
  );
  const showNewtonAccel = useHoverProfileStore(
    (state) => state.showNewtonAccel
  );
  const showNewtonForce = useHoverProfileStore(
    (state) => state.showNewtonForce
  );

  const [eqn] = useSpring(
    () => ({
      from: {
        opacity: 0,
        display: "none",
      },
      to: async (next) => {
        showNewton && (await next({ display: "flex" }));
        await next({ opacity: showNewton ? 1 : 0 });
        showNewton || (await next({ display: "none" }));
      },
    }),
    [showNewton]
  );

  const [dV] = useSpring(
    () => ({
      from: {},
      to: async (next) => {
        showNewtonVelocity && next({ width: "1.5rem" });
        await next({ opacity: showNewtonVelocity ? 1 : 0 });
        showNewtonVelocity || (await next({ width: "0rem" }));
      },
    }),
    [showNewtonVelocity]
  );

  const [force] = useSpring(
    () => ({
      from: {},
      to: async (next) => {
        showNewtonForce && next({ width: "8rem" });
        await next({ opacity: showNewtonForce ? 1 : 0, delay: 250 });
        showNewtonForce || (await next({ width: "0rem", delay: 250 }));
      },
    }),
    [showNewtonForce]
  );

  const [acc] = useSpring(
    () => ({
      from: {marginTop: "5px"},
      to: async (next) => {
        showNewtonAccel && next({ width: "1.5rem" });
        await next({ opacity: showNewtonAccel ? 1 : 0, delay: 250 });
        showNewtonAccel || (await next({ width: "0rem", delay: 250 }));
      },
    }),
    [showNewtonAccel]
  );

  return (
    <animated.div
      className="fixed w-full h-full flex justify-center items-center translate-y-1/4 text-4xl"
      style={eqn}
    >
      <Formula style={force} tex="\vec{F} = m" />
      <Formula style={dV} tex="\frac {d \vec{V} } {dt}" />
      <Formula style={acc} tex="\vec{a}" />
    </animated.div>
  );
};

export default IntroNewton2nd;
