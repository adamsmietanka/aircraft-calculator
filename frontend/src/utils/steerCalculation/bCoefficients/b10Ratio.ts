import polynomynalFunction from "../../math_estimation/polynomynalFunction";

const b10Ratio = () => {
  let x: number= 0;
  let z: number= 0;
  const coef = {
    a: [-2.7583803351551826, 2.7774933769043777],
    b: [-4.16168203967543, 11.009337371974574, -5.855907172029746],
  };
  return (
    polynomynalFunction(z, coef["a"]) * x + polynomynalFunction(z, coef["b"])
  );
};

export default b10Ratio;
