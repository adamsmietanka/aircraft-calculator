import polynomynalFunction from "../../math_estimation/polynomynalFunction";
import expotentialFunction from "../../math_estimation/expotentialFunction";

const F2correction = (aspectRatio: number, a10: number, chordRatio: number) => {
  let x: number = (aspectRatio * 5.73) / a10;
  let z: number = chordRatio;
  const coefs = {
    a1: [-0.031401494312525605, -0.019957008462610754, 0.08403369827189405],
    b1: [-0.12713710128667963, 0.0491435011799554, 0.4155327785270086],
    c1: [0.005462646552070578, 0.7130453004679701, -0.0005261548314978549],
  };
  return expotentialFunction(
    x,
    polynomynalFunction(z, coefs["a1"]),
    -polynomynalFunction(z, coefs["b1"]),
    polynomynalFunction(z, coefs["c1"])
  );
};

export default F2correction;
