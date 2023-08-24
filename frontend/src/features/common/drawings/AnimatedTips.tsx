import { SpringValue } from "@react-spring/three";
import AnimatedTip from "./AnimatedTip";

interface Props {
  scale: SpringValue<number>;
  value?: SpringValue<number>;
}

const AnimatedTips = ({ scale, value = new SpringValue(0) }: Props) => {
  return (
    <>
      <AnimatedTip scale={scale} />
      <AnimatedTip scale={scale} value={value} end />
    </>
  );
};

export default AnimatedTips;
