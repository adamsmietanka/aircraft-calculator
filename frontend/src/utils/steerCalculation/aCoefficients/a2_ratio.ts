import polynomynalFunction from "../../math_estimation/polynomynalFunction";

const a2_ratio = (a1Ratio: number, chordRatio: number) => {
  const params = {
    a1: [6.6317854, -10.68694862, 3.9873005],
    b1: [2.08816745, -1.15933741],
    c1: [2.29586863, -1.32065881],
  };
  if (a1Ratio >= 1) {
    console.log(
      "Warning:In a2ratio estimation the value of a1ratio exeedds or is equal to 1. The value of the of a2ratio is automatically set to 1."
    );
    return 1;
  }
  let a2 =
    polynomynalFunction(a1Ratio, params["a1"]) *
      chordRatio *
      Math.log(polynomynalFunction(a1Ratio, params["b1"]) * chordRatio) +
    polynomynalFunction(a1Ratio, params["c1"]);
  if (a2 >= 1) {
    console.log(
      "Warning:In a2ratio estimation the estimated of a1ratio exeedds or is equal 1. The value of the of a2ratio is automatically set to 1."
    );
    return 1;
  } else {
    return a2;
  }
};

export default a2_ratio;
