import polynomynalFunction from "../../math_estimation/polynomynalFunction";

const a2_ratio = (a1Ratio: number, chordRatio: number) => {
  const params = {
    a1: [6.6317854, -10.68694862, 3.9873005],
    b1: [2.08816745, -1.15933741],
    c1: [2.29586863, -1.32065881],
  };
  return (
    polynomynalFunction(a1Ratio, params["a1"]) *
      chordRatio *
      Math.log(polynomynalFunction(a1Ratio, params["b1"]) * chordRatio) +
    polynomynalFunction(a1Ratio, params["c1"])
  );
};

export default a2_ratio;
