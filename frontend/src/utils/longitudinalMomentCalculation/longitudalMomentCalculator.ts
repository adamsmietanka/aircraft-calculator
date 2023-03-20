import {
  fuselageStaticLongitudonalMoment,
  getNeutralStabillityPoint,
} from "./fuselageLongitudinalMoment";
import { wingLongitudonalMoment } from "./wingLongitudinalMoment";

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

export const longitudalMoment = (
  {
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
  }: props,
  gondole: boolean
) => {
  let cm_p = wingLongitudonalMoment(cm0p, alfa, cx, cz, x_sa, x_sc, z_sa, z_sc);
  let cm_0_f = fuselageStaticLongitudonalMoment(
    w,
    s_b,
    s_bf,
    l_bf,
    l_b,
    c_a,
    S,
    i_w
  );
  let fuselageDeltaX = getNeutralStabillityPoint(l_b, l_bf, c_a, S, b_k, c_0);
  let cm_f = cz.map((x) => fuselageDeltaX * x + cm_0_f);

  let cm_g = cm_f.map((x) => 0);
  let gondoleDeltaX = 0;
  let cm_0_g = 0;
  if (gondole) {
    if (s_b_g && s_bf_g && w_g && l_b_g && l_bf_g && i_w_g) {
      cm_0_g = fuselageStaticLongitudonalMoment(
        w_g,
        s_b_g,
        s_bf_g,
        l_bf_g,
        l_b_g,
        c_a,
        S,
        i_w_g
      );
      gondoleDeltaX= getNeutralStabillityPoint(l_b_g, l_bf_g, c_a, S, b_k, c_0)
      cm_g = cz.map((x) => gondoleDeltaX * x + cm_0_g);
    }
  }

  let cm_bu = alfa.map((aoa) => 0);
  for (let i = 0; i < cm_f.length; i++) {
    cm_bu[i] = cm_p[i] + cm_f[i] + cm_g[i];
  }

  console.log("Values of the longitudinal moment:", {
    FuselageNeutralpoint:-fuselageDeltaX,
    cmf0: cm_0_f,
    GondoleNeutralpoint:-gondoleDeltaX,
    cm_0_g: cm_0_g,
  });
  return {cmbu:cm_bu,deltaXFuselage:-fuselageDeltaX};
};
