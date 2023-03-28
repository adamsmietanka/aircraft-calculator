import expotentialFunction from "../../math_estimation/expotentialFunction";
import polynomynalFunction from "../../math_estimation/polynomynalFunction";
import { degTorad } from "../../misc";

const tauCoefficient = (
  a10M: number,
  effectiveWingSweep: number,
  aspectRatio: number,
  covergence: number
) => {
  let x = aspectRatio / (a10M * Math.cos(degTorad(effectiveWingSweep)));
  let z = covergence;
  if (covergence < 0.25) {
    let params = {
      a1: [-0.5415319516975491, 0.23794563221007284, -0.04962332974281004],
      b1: [9.741435751117868, 7.776575443243016, 0.729878288794629],
      c1: [0.5308691699655134, -0.2229304151007418, 0.045905525825382765],
      d1: [-0.019100962635546233, 0.037008405592826844, -0.024849493190593513],
    };
    let a = polynomynalFunction(z, params.a1);
    let b = polynomynalFunction(z, params.b1);
    let c = polynomynalFunction(z, params.c1);
    let d = polynomynalFunction(z, params.d1);
    return expotentialFunction(x, a, b, c) + d * Math.pow(Math.sin(x), 2);
  } else {
    let params = {
      a1: [2.74483914670282, -1.254301742515751, 0.17301494598784017],
      b1: [-1.7186600287492406, 2.019842508530752],
      c1: [0.4219468598925175, -0.1485003191089818, 0.011076779234551441],
    };
    let a = polynomynalFunction(z, params.a1);
    let b = polynomynalFunction(z, params.b1);
    let c = polynomynalFunction(z, params.c1);
    return a * Math.tanh(b * x) - 0.018 * x + c;
  }
};

export default tauCoefficient;
