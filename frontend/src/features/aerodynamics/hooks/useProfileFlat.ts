import { NUMBER_OF_AIRFOIL_POINTS } from "../../common/three/config";

const useProfileFlat = (T: number) => {
  let upper = [];
  let lower = [];
  let chord = [];

  const verticalPoints = 2;
  for (let i = 0; i <= NUMBER_OF_AIRFOIL_POINTS; i++) {
    let x, y;
    if (i < verticalPoints) {
      x = 0;
      y = ((i / verticalPoints) * T) / 2;
    } else if (i <= NUMBER_OF_AIRFOIL_POINTS - verticalPoints) {
      x =
        (i - verticalPoints) / (NUMBER_OF_AIRFOIL_POINTS - 2 * verticalPoints);
      y = T / 2;
    } else {
      x = 1;
      y = (((NUMBER_OF_AIRFOIL_POINTS - i) / verticalPoints) * T) / 2;
    }

    lower.push([x, -y, 0]);
    upper.push([x, y, 0]);
    chord.push([x, 0, 0]);
  }
  const max = [
    [1, -T / 2, 0],
    [1, T / 2, 0],
  ];

  return {
    upper,
    lower,
    chord,
    max,
  };
};

export default useProfileFlat;
