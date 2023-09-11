import { Html } from "@react-three/drei";
import React from "react";
import { useSpring, animated } from "@react-spring/web";

interface Props {
  color: string;
  show: boolean;
  children: React.ReactNode;
}

const AnimatedHtml = ({ color, show, children }: Props) => {
  const Anim = animated(Html);

  const [props] = useSpring(
    () => ({
      opacity: show ? 1 : 0,
    }),
    [show]
  );
  return (
    <Anim center className={`text-${color} space-y-4 h-20`} style={props} transform>
      {children}
    </Anim>
  );
};

export default AnimatedHtml;
