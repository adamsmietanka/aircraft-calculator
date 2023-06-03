import polynomynalFunction from "../../math_estimation/polynomynalFunction";
import { degTorad } from "../../misc";
// tau w stopniach
const a1_ratio = (tau: number, reynoldsNumber: number) => {
  const params = {
    a: [
      [-0.21038898989478116, 0.21038898989478116],
      [-0.0007531718370585787, -1.8859691906824447],
    ],
    b: [
      [0.05699483186590805, -0.8862982307236102],
      [0.0014612959935508079, -0.33096287200003793],
    ],
    c: [
      [0.004922221551032823, 0.8959086726344847],
      [0.0002382139563631326, 0.9427487485811816],
    ],
  };
  let x = Math.tan(0.5 * degTorad(tau));
  let z = reynoldsNumber / 1000000;
  let i = 0;
  if (z > 10) {
    i = 1;
  }

  let coefs = [
    polynomynalFunction(z, params["a"][i]),
    polynomynalFunction(z, params["b"][i]),
    polynomynalFunction(z, params["c"][i]),
  ];
  return polynomynalFunction(x, coefs);
};

export default a1_ratio;
