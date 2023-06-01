import polynomynalFunction from "../../math_estimation/polynomynalFunction";

const b10Ratio = (chordRatio:number,a1Ratio:number) => {
  let x: number= chordRatio;
  let z: number= a1Ratio;
  if (z ===1) return 1
  const coef = {
    a: [-2.7583803351551826, 2.7774933769043777],
    b: [-4.16168203967543, 11.009337371974574, -5.855907172029746],
  };
  return (
    polynomynalFunction(z, coef["a"]) * x + polynomynalFunction(z, coef["b"])
  );
};

export default b10Ratio;
