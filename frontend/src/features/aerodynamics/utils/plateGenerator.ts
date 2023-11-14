import plate, { plates } from "../data/flatPlate";

const getCdOfPlate = (x: number) => {
  return (
    (44.21 * Math.pow(x, 6) -
      153.11 * Math.pow(x, 5) +
      208.97 * Math.pow(x, 4) -
      142.89 * Math.pow(x, 3) +
      51.507 * x * x -
      9.4 * x +
      1.8822) *
    x
  );
};

export const plateGenerator = () => {
  let results: Record<string, Record<string, Array<Array<number | null>>>> = {};

  const brick = plate.map(([aoa, cz]) => [aoa / 2, cz / 2]);

  plates.forEach((p) => {
    const t = parseFloat(p) / 100;
    if (p === "30") {
      results[p] = {
        cz: brick.map(([aoa, cz]) => [aoa, cz, cz, cz]),
        cd: brick
          .filter(([aoa, cz]) => -5.1 < aoa && aoa < 5.1)
          .map(([aoa, cz]) => {
            const cd =
              cz * Math.sin((aoa * Math.PI) / 180) +
              0.5 * t * Math.cos((aoa * Math.PI) / 180);
            return [cz, cd, cd, cd];
          }),
      };
    } else {
      results[p] = {
        cz: plate.map(([aoa, cz]) => [aoa, cz, cz, cz]),
        cd: plate
          .filter(([aoa, cz]) => -10.23 < aoa && aoa < 10.23)
          .map(([aoa, cz]) => {
            const cd =
              cz * Math.sin((aoa * Math.PI) / 180) +
              0.3 * t * Math.cos((aoa * Math.PI) / 180);
            return [cz, cd, cd, cd];
          }),
      };
    }
  });
  console.log(results);
};
