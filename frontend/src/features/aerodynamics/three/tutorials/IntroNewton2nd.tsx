import { animated, useSpring } from "@react-spring/web";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import Formula from "../../../common/Formula";

const IntroNewton2nd = () => {
  const show = useHoverProfileStore((state) => state.showNewton);
  const velocity = useHoverProfileStore((state) => state.showNewtonVelocity);
  const acceleration = useHoverProfileStore((state) => state.showNewtonAccel);
  const force = useHoverProfileStore((state) => state.showNewtonForce);

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

  const [dV] = useSpring(
    () => ({
      from: {},
      to: async (next) => {
        velocity && next({ width: "1.5rem" });
        await next({ opacity: velocity ? 1 : 0 });
        velocity || (await next({ width: "0rem" }));
      },
    }),
    [velocity]
  );

  const [F] = useSpring(
    () => ({
      from: {},
      to: async (next) => {
        force && next({ width: "8rem" });
        await next({ opacity: force ? 1 : 0, delay: 250 });
        force || (await next({ width: "0rem", delay: 250 }));
      },
    }),
    [force]
  );

  const [acc] = useSpring(
    () => ({
      from: { marginTop: "5px" },
      to: async (next) => {
        acceleration && next({ width: "1.5rem" });
        await next({ opacity: acceleration ? 1 : 0, delay: 250 });
        acceleration || (await next({ width: "0rem", delay: 250 }));
      },
    }),
    [acceleration]
  );

  return (
    <animated.div
      className="fixed w-full h-full flex justify-center items-center translate-y-1/4 text-4xl"
      style={eqn}
    >
      <Formula style={F} tex="\vec{F} = m" />
      <Formula style={dV} tex="\frac {d \vec{V} } {dt}" />
      <Formula style={acc} tex="\vec{a}" />
    </animated.div>
  );
};

export default IntroNewton2nd;
