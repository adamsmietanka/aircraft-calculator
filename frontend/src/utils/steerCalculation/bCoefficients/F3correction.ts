import polynomynalFunction from "../../math_estimation/polynomynalFunction";
import expotentialFunction from "../../math_estimation/expotentialFunction";

const F3correction = (chordRatio: number,balance:number) => {
  let x: number = chordRatio;
  let z: number = balance
  const coefs = {
    a1: [-2.3586141561534784, 0.49838414079313176, 0.5525367969331235],
    b1: [21.0193503583672, 35.78325218968612, 14.871085549065755],
    c1: [-0.6724348132975206, 1.536959579741495],
    d1: [-0.045841743699084975, 0.020077689715717995],
  };
  let a  = polynomynalFunction(z, coefs["a1"]);
  let b = expotentialFunction(z, coefs["b1"][0],-coefs["b1"][1],coefs["b1"][2]);
  let c = polynomynalFunction(z, coefs["c1"]);
  let d = polynomynalFunction(z, coefs["c1"])
  return a*Math.tanh(b*x)+c*Math.sinh(x)+d
};

export default F3correction;
