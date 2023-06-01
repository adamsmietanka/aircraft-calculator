import polynomynalFunction from "../../math_estimation/polynomynalFunction";
import { degTorad } from "../../misc";

const spanCorrection = (
  spans: number[],
  wingSpan: number,
  aspectRatio: number,
  covergence: number,
  angle025: number
) => {
  let coefs = spans.map((span) => [
    k1Calc(span / wingSpan, covergence),
    k2Calc(span / wingSpan, covergence),
    k3Calc(span / wingSpan, covergence),
  ]);
  let newCoef = coefs.map(
    (coef) =>
      coef[0] *
      (1 + coef[1] * (aspectRatio - 6) + coef[2] * Math.sin(degTorad(angle025)))
  );

  return newCoef[0] - newCoef[1];
};

export default spanCorrection;

const k1Calc = (spanRatio: number, covergence: number) => {
  const params = [
    [0.02499652686085524, -0.31953827553053454, -0.11285062707376724],
    [-0.3891811544135659, 1.219157519983073, -0.528142895900229],
    [0.36273295065028316, -0.9017136260390132, 1.632262705622886],
    [-0.015254271457683615, 0.016388071677042117, 0.007090862426835493],
  ];
  return polynomynalFunction(
    spanRatio,
    params.map((param) => polynomynalFunction(covergence, param))
  );
};

const k2Calc = (spanRatio: number, covergence: number) => {
  const params = [
    [-0.006571321911320102, 0.04295642814040207, -0.017885650918608942],
    [0.006453920160757609, -0.042806091546637504, 0.01784471607540685],
  ];
  return polynomynalFunction(
    spanRatio,
    params.map((param) => polynomynalFunction(covergence, param))
  );
};

const k3Calc = (spanRatio: number, covergence: number) => {
  const params = [
    [-0.35923795965970634, 0.05938841460745708, 0.26192882553879754],
    [0.5254516986542979, 0.0032189819858942587, -0.3943733699354342],
    [-0.0746219409025826, -0.1168722720117291, 0.06950280783269364],
    [-0.0846434386449263, 0.08346841349347507, -0.06417287834443039],
    [-0.010234625414330251, -0.02869356042544563, 0.12933223358460783],
  ];
  return polynomynalFunction(
    spanRatio,
    params.map((param) => polynomynalFunction(covergence, param))
  );
};
