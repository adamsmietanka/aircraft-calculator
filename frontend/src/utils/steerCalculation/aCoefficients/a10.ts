import { chartdata } from "./a10Ttoa10ratioConstant";
import polynomynalFunction from "../../math_estimation/polynomynalFunction";

//Reynolds number can be between 1 - 100 mln
//tan(tauAlfa/2) - degrees
const a10 = (reynoldsNumber: number, tanTauAlfa2: number) => {
  let Re: number = reynoldsNumber / 1000000;
  let a_line: number[][] = chartdata["a"];
  let b_line: number[][] = chartdata["b"];
  let c_line: number[][] = chartdata["c"];

  let i = 0;
  if (Re > 10) {
    i = 1;
  }

  let a: number = a_line[i][0] * Re + a_line[i][1];
  let b: number = b_line[i][0] * Re + b_line[i][1];
  let c: number = c_line[i][0] * Re + c_line[i][1];

  return polynomynalFunction(tanTauAlfa2, [a, b, c]);
};

export default a10;
