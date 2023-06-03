import polynomynalFunction from "../../math_estimation/polynomynalFunction";
import expotentialFunction from "../../math_estimation/expotentialFunction";

const F1correction = (aspectRatio: number, a10: number, chordRatio: number) => {
  let x: number = (aspectRatio * 5.73) / a10;
  let z: number = chordRatio;
  const coefs = {
    a1: [0.05818459577300496, 0.24916861116211397, 0.43555260654170747],
    b1: [0.08295765060697648, 0.2099147668936272],
    c1: [0.030948783872803955, 0.0915446516794793],
  };
  return expotentialFunction(
    x,
    polynomynalFunction(z, coefs["a1"]),
    -polynomynalFunction(z, coefs["b1"]),
    polynomynalFunction(z, coefs["c1"])
  );
};

export default F1correction;
