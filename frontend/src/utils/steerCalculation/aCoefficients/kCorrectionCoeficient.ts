import expotentialFunction from "../../math_estimation/expotentialFunction";

const kCoefficient = (aspectRatio: number) => {
  return expotentialFunction(aspectRatio, 1.065, -0.896, 0.051);
};

export default kCoefficient;
