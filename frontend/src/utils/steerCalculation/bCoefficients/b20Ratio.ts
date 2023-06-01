import polynomynalFunction from "../../math_estimation/polynomynalFunction";

const b20Ratio = (chordRatio: number, a2Ratio: number) => {
  let x: number = chordRatio;
  let z: number = a2Ratio;
  if (z === 1) return 1;
  const coefs = [
    [-7.316738147584871, 13.982375045951793, -6.710612145798552],
    [0.22336084623340355, -0.21564392208695338],
    [-0.44635037691559587, 1.5426604603411613, -0.0967020313951461],
  ];
  return -polynomynalFunction(
    x,
    coefs.map((coef) => polynomynalFunction(z, coef))
  );
};

export default b20Ratio;
