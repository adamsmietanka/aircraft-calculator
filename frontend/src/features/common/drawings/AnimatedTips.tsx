import { SpringValue } from "@react-spring/three";
import AnimatedTip from "./AnimatedTip";

interface Props {
  scale: SpringValue<number>;
  value?: SpringValue<number>;
  opacity?: SpringValue<number>;
}

const AnimatedTips = ({ scale, value = new SpringValue(0), opacity }: Props) => {
  return (
    <>
      <AnimatedTip opacity={opacity} scale={scale} />
      <AnimatedTip opacity={opacity} scale={scale} value={value} end />
    </>
  );
};

export default AnimatedTips;
