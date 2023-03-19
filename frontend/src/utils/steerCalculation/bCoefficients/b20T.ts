import polynomynalFunction from "../../math_estimation/polynomynalFunction";
import expotentialFunction from "../../math_estimation/expotentialFunction";

const b20T = (chordRatio: number, profileThickness: number) => {
  let x: number = chordRatio;
  let z: number = profileThickness;
  if (z > 0.6){
    console.log("warninng b20T value might be inaccurate")
  }
  const coefs = [
    [-1.404420584727146, 0.10331815869231348],
    [4.369000069965416, 0.43480510706194775],
    [-1.074208871650356, -2.099212089925327, 0.825110453627748],
  ];
  return polynomynalFunction(
    x,
    coefs.map((coef) => polynomynalFunction(z, coef))
  );
};

export default b20T;
