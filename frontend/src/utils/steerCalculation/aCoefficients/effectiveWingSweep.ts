import { degTorad, radTodeg } from "../../misc";

const effectiveWingSweep = (
  wing025Sweep: number,
  machNumber: number,
  aspectRatio: number,
  wingCovergence: number
) => {
  let wing025SweepRad = degTorad(wing025Sweep);
  let result =
    (Math.tan(wing025SweepRad) -
      wing025Sweep / (45 * aspectRatio * (1 + wingCovergence)));
  return radTodeg(Math.atan(result));
};

export default effectiveWingSweep;
