import expotentialFunction from "../../math_estimation/expotentialFunction";

const a2_m = (
  chordRatio: number,
  steerAspectRatio: number,
  MachNumber: number
) => {
  const coef = {
    a: [-0.32402256, 0.23471181, -0.0112854],
    b: [0.33258045, 0.21354664, 0.99393945],
  };
  let x = chordRatio;
  let z = steerAspectRatio * Math.sqrt(1 - Math.pow(MachNumber, 2));
  return (
    expotentialFunction(z, coef["a"][0], -coef["a"][1], coef["a"][2]) * x +
    expotentialFunction(z, coef["b"][0], -coef["b"][1], coef["b"][2])
  );
};

export default a2_m;
