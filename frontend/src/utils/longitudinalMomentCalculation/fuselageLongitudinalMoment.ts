import { fuselage_report_data } from "../../data/constants/coefA080101";

export const fuselageStaticLongitudonalMoment = (
  fuselageWidth: number,
  fuselageSurface: number,
  frontFuselageSurface: number,
  frontLenghtSurface: number,
  fuselageLenght: number,
  MAC: number,
  wingArea: number,
  wingInclinationAngle: number
) => {
  let z = parseFloat((Math.pow(fuselageWidth, 2) / fuselageSurface).toFixed(2));

  let x =
    ((frontFuselageSurface / fuselageSurface) * frontLenghtSurface) /
    fuselageLenght;

  let i = fuselage_report_data.z.findIndex((zValue) => zValue === z);
  let a1 = fuselage_report_data.a1[i];
  let b1 = fuselage_report_data.b1[i];
  let c1 = fuselage_report_data.c1[i];
  let a2 = fuselage_report_data.a2[i];
  let b2 = fuselage_report_data.b2[i];
  let c2 = fuselage_report_data.c2[i];

  let y = Math.exp(x);
  if (x > 0.2) {
    y = a1 * Math.exp(-b1 * x) + c1;
  } else if (x < 0.2) {
    y = a2 * Math.exp(-b2 * x) + c2;
  } else {
    y = (a2 * Math.exp(-b2 * x) + c2 + a1 * Math.exp(-b1 * x) + c1) / 2;
  }
  return (
    ((y * fuselageSurface * fuselageLenght) / (wingArea * MAC)) *
    wingInclinationAngle
  );
};

export const getNeutralStabillityPoint = (
  l_b: number,
  l_bf: number,
  c_a: number,
  S: number,
  b_k: number,
  c_0: number
) => {
  let x = c_a / l_b;
  let z = l_bf / l_b;
  let y =
    (2.024 * z + 1.301) *
    Math.exp(-(-3.275 * z + 9.522) * x + (0.925 * z - 0.219));
  let deltaX = (y * b_k * c_0 * c_0) / (S * c_a);
  return deltaX;
};
