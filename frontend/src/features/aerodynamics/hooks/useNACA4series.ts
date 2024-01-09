import { NUMBER_OF_AIRFOIL_SEGMENTS } from "../../common/three/config";

const useNACA4series = (M: number, P: number, T: number, F: number) => {
  const getCamberY = (x: number) => {
    if (x < P) {
      return (M / Math.pow(P, 2)) * (2 * P * x - x * x);
    }
    return (M / Math.pow(1 - P, 2)) * (1 - 2 * P + 2 * P * x - x * x);
  };

  const getCamberGradient = (x: number) => {
    if (x < P) {
      return ((2 * M) / Math.pow(P, 2)) * (P - x);
    }
    return ((2 * M) / Math.pow(1 - P, 2)) * (P - x);
  };

  const getThickness = (x: number) => {
    return (
      5 *
      T *
      (0.2969 * Math.pow(x, 0.5) -
        0.126 * x -
        0.3516 * Math.pow(x, 2) +
        0.2843 * Math.pow(x, 3) -
        0.1036 * Math.pow(x, 4))
    );
  };

  const getLowerUpper = (x: number) => {
    const theta = Math.atan(getCamberGradient(x));
    const halfThickness = getThickness(x);
    const y = getCamberY(x);
    return [
      [
        x + halfThickness * Math.sin(theta),
        y - halfThickness * Math.cos(theta),
        0,
      ],
      [
        x - halfThickness * Math.sin(theta),
        y + halfThickness * Math.cos(theta),
        0,
      ],
    ];
  };

  const cosineSpacing = (x: number) => (1 - Math.cos(x * Math.PI)) / 2;

  let upper = [];
  let lower = [];
  let chord = [];

  for (let i = 0; i <= NUMBER_OF_AIRFOIL_SEGMENTS; i++) {
    const x = cosineSpacing(i / NUMBER_OF_AIRFOIL_SEGMENTS);
    const y = getCamberY(x);
    const points = getLowerUpper(x);

    lower.push(points[0]);
    upper.push(points[1]);
    chord.push([x, y, 0]);
  }
  const max = getLowerUpper(F);

  return {
    upper,
    lower,
    chord,
    max,
  };
};

export default useNACA4series;
