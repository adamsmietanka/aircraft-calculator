import InputUnits from "../../common/inputs/InputUnits";
import { useWingStore } from "../stores/useWing";
import { Html } from "@react-three/drei";
import { SpringValue, animated, to } from "@react-spring/three";

interface Props {
  scale: SpringValue<number>;
  x: SpringValue<number>;
  y: SpringValue<number>;
}

const WingInputs = ({ scale, x, y }: Props) => {
  const wing = useWingStore();

  return (
    <animated.mesh
      position={to([x, y, scale], (x, y, scale) => [x, y + 1.5 / scale, 0])}
      scale={scale.to((scale) => [1 / scale, 1 / scale, 1 / scale])}
    >
      <Html
        className="select-none"
        color="black"
        transform
      >
        <InputUnits
          label="Tip Chord"
          type="length"
          value={wing.chordTip}
          setter={wing.setChordTip}
        />
      </Html>
    </animated.mesh>
  );
};

export default WingInputs;
