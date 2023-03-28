import { degTorad } from "../misc";

//alfa+-10, len alfa = len cx = len cz
export const wingLongitudonalMoment = (
    cm0p:number,
    alfaArray:number[],
    cxArray:number[],
    czArray:number[],
    x_sa:number,
    x_sc:number,
    z_sa:number,
    z_sc:number,
  ) => {
    let Cm_p = alfaArray.map((x) => x);
    for (let i = 0; i < alfaArray.length; i++) {
      Cm_p[i] =
        cm0p +
        czArray[i] * (x_sc - x_sa) +
        (cxArray[i] - czArray[i] * degTorad(alfaArray[i])) * (z_sc - z_sa);
    }
    return Cm_p;
  };