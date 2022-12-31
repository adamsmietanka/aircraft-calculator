import { degTorad } from "./misc";

interface wingDataCalculation {
  cm0p: number;
  alfa: Array<number>;
  cx: Array<number>;
  cz: Array<number>;
  x_sa: number;
  x_sc: number;
  z_sa: number;
  z_sc: number;
}

interface staticMomentData {
  s_b: number;
  s_bf: number;
  w: number;
  l_b: number;
  l_bf: number;
  c_a: number;
  i_w: number;
  S: number;
}

interface dynamicMomentData {
  cz: Array<number>;
  l_b: number;
  l_bf: number;
  c_a: number;
  S: number;
  b_k: number;
  c_0: number;
}

interface props {
  //gondole
  s_b_g?: number;
  s_bf_g?: number;
  w_g?: number;
  l_b_g?: number;
  l_bf_g?: number;
  i_w_g?: number;

  //Fuselage
  s_b: number;
  s_bf: number;
  w: number;
  l_b: number;
  l_bf: number;
  c_a: number;
  i_w: number;
  S: number;
  c_0: number;
  b_k: number;

  //Wing
  cm0p: number;
  alfa: Array<number>;
  cx: Array<number>;
  cz: Array<number>;
  x_sa: number;
  x_sc: number;
  z_sa: number;
  z_sc: number;
}

//alfa+-10, len alfa = len cx = len cz
const wingLongitudonalMoment = ({
  cm0p,
  alfa,
  cx,
  cz,
  x_sa,
  x_sc,
  z_sa,
  z_sc,
}: wingDataCalculation) => {
  let Cm_p = alfa.map((x) => x);
  for (let i = 0; i < alfa.length; i++) {
    Cm_p[i] =
      cm0p + cz[i] * (x_sc - x_sa) + (cx[i] - cz[i] * degTorad(alfa[i])) * (z_sc - z_sa);
  }
  return Cm_p;
};

const staticMomentData = ({
  s_b,
  s_bf,
  w,
  l_b,
  l_bf,
  c_a,
  i_w,
  S,
}: staticMomentData) => {
  let x = ((s_bf / s_b) * l_bf) / l_b;
  let z = (w * w) / s_b;
  let y = getCm0bPlotValue(x, z);
  return (y * i_w * s_b * l_b) / (S * c_a);
};

const getCm0bPlotValue = (x: number, y: number) => {
  const value = 1;
  return value;
};

const dynamicMomentData = ({
  cz,
  l_b,
  l_bf,
  c_a,
  S,
  b_k,
  c_0,
}: dynamicMomentData) => {
  let x = c_a / l_b;
  let z = l_bf / l_b;
  let y = getDeltaXplotvalue(x, z);
  let deltaX = (y * b_k * c_0 * c_0) / (S * c_a);
  let cm_f = cz.map((cz) => deltaX * cz);
  return cm_f;
};

const getDeltaXplotvalue = (x: number, y: number) => {
  const value = 1;
  return value;
};

export const longitudalMoment = ({
  s_b_g,
  s_bf_g,
  w_g,
  l_b_g,
  l_bf_g,
  i_w_g,
  s_b,
  s_bf,
  w,
  l_b,
  l_bf,
  c_a,
  i_w,
  S,
  c_0,
  b_k,
  cm0p,
  alfa,
  cx,
  cz,
  x_sa,
  x_sc,
  z_sa,
  z_sc,
}: props) => {
  let cm_p = wingLongitudonalMoment({
    cm0p,
    alfa,
    cx,
    cz,
    x_sa,
    x_sc,
    z_sa,
    z_sc,
  });
  const cmf_0 = staticMomentData({
    s_b,
    s_bf,
    w,
    l_b,
    l_bf,
    c_a,
    i_w,
    S,
  });
  let cm_f = dynamicMomentData({
    cz,
    l_b,
    l_bf,
    c_a,
    S,
    b_k,
    c_0,
  });
  cm_f = cm_f.map((x) => x + cmf_0);

  let cm_g = cm_f.map((x) => 0);
  if (s_b_g && s_bf_g && w_g && l_b_g && l_bf_g && i_w_g) {
    s_b = s_b_g;
    s_bf = s_bf_g;
    w = w_g;
    l_b = l_b_g;
    l_bf = l_bf_g;
    i_w = i_w_g;
    const cm_0_g = staticMomentData({
      s_b,
      s_bf,
      w,
      l_b,
      l_bf,
      c_a,
      i_w,
      S,
    });
    cm_g = dynamicMomentData({
      cz,
      l_b,
      l_bf,
      c_a,
      S,
      b_k,
      c_0,
    });
    cm_g.map((x) => x + cm_0_g);
  }

  let cm_bu = alfa.map((aoa) => 0);
  for (let i = 0; i < cm_f.length; i++) {
    cm_bu[i] = cm_p[i] + cm_f[i] + cm_g[i];
  }
  return cm_bu;
};
