import polynomynalFunction from "../../math_estimation/polynomynalFunction";
import expotentialFunction from "../../math_estimation/expotentialFunction";

const b10T = (chordRatio: number, profileThickness: number) => {
  let x: number = chordRatio;
  let z: number = profileThickness;
  const coef = {
    a1: [
      65.532586838751, -29.312969640923058, 2.781359416338298,
      0.1904771906011673,
    ],
    b1: [16.4778010789388, 102.15822765100636, 10.368621977631044],
    c1: [29.081334801184784, -4.58066154435732, 1.3468183350822305],
    d1: [4.013555879606232, -1.1058517754236867, 0.03215066212012577],
  };
  let a = polynomynalFunction(z, coef["a1"]);
  let b = expotentialFunction(z, coef["b1"][0], coef["b1"][1], coef["b1"][2]);
  let c = polynomynalFunction(z, coef["c1"]);
  let d = polynomynalFunction(z, coef["d1"]);
  return -(a * Math.tanh(b * x) + c * x + d);
};

export default b10T;
