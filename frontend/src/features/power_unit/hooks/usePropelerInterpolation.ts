import {
  findLowerBound,
  linearInterpolation,
} from "../../../utils/interpolation/binarySearch";
import { data } from "../data/prop";
import { usePropellerStore } from "../stores/usePropeller";

export const usePropellerInterpolation = () => {
  const blades = usePropellerStore((state) => state.blades);
  const x = data.cn;
  const y = data[blades];
  const interpolateJ = (cn: number) => {
    const index = findLowerBound(x, cn);
    return linearInterpolation(
      x[index],
      y[index],
      x[index + 1],
      y[index + 1],
      cn
    );
  };
  return [interpolateJ];
};
