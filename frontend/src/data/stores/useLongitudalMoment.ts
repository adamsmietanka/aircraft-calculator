import create from "zustand";

interface LongitudalMomentState {
  //gondole
  s_b_g: number;
  s_bf_g: number;
  w_g: number;
  l_b_g: number;
  l_bf_g: number;
  i_w_g: number;
  setS_b_g: (value: number) => void;
  setS_bf_g: (value: number) => void;
  setW_g: (value: number) => void;
  setL_b_g: (value: number) => void;
  setL_bf_g: (value: number) => void;
  setI_w_g: (value: number) => void;
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
  setS_b: (value: number) => void;
  setS_bf: (value: number) => void;
  setW: (value: number) => void;
  setL_b: (value: number) => void;
  setL_bf: (value: number) => void;
  setC_a: (value: number) => void;
  setI_w: (value: number) => void;
  setS: (value: number) => void;
  setC0: (value: number) => void;
  setb_k: (value: number) => void;
  //Wing
  cm0p: number;
  alfa: Array<number>;
  cx: Array<number>;
  cz: Array<number>;
  x_sa: number;
  x_sc: number;
  z_sa: number;
  z_sc: number;
  setCm0p: (value: number) => void;
  setAlfa: (value: Array<number>) => void;
  setCx: (value: Array<number>) => void;
  setCz: (value: Array<number>) => void;
  setX_sc: (value: number) => void;
  setX_sa: (value: number) => void;
  setZ_sc: (value: number) => void;
  setZ_sa: (value: number) => void;
}

export const useLongitudalMomentStore = create<LongitudalMomentState>()(
  (set) => ({
    //fuselage
    s_b_g: 2,
    s_bf_g: 0.3,
    w_g: 1.2,
    l_b_g: 5,
    l_bf_g: 3,
    i_w_g: 1,
    setS_b_g: (value) => set((state) => ({ cm0p: value })),
    setS_bf_g: (value) => set((state) => ({ s_bf: value })),
    setW_g: (value) => set((state) => ({ w: value })),
    setL_b_g: (value) => set((state) => ({ l_b: value })),
    setL_bf_g: (value) => set((state) => ({ l_bf: value })),
    setI_w_g: (value) => set((state) => ({ i_w: value })),

    //fuselage
    s_b: 8.255,
    s_bf: 2.308,
    w: 0.997,
    l_b: 8.255,
    l_bf: 2.797,
    c_a: 1.9,
    i_w: 0.065,
    S: 17.44,
    c_0: 2.6,
    b_k: 0.97,
    setS_b: (value) => set((state) => ({ cm0p: value })),
    setS_bf: (value) => set((state) => ({ s_bf: value })),
    setW: (value) => set((state) => ({ w: value })),
    setL_b: (value) => set((state) => ({ l_b: value })),
    setL_bf: (value) => set((state) => ({ l_bf: value })),
    setC_a: (value) => set((state) => ({ c_a: value })),
    setI_w: (value) => set((state) => ({ i_w: value })),
    setS: (value) => set((state) => ({ S: value })),
    setC0: (value) => set((state) => ({ c_0: value })),
    setb_k: (value) => set((state) => ({ b_k: value })),
    //wing
    cm0p: -0.001,
    alfa: [
      -11.18, -9.66, -8.57, -7.08, -6.35, -4.84, -3.35, -2.85, -1.3, -0.01,
      0.29, 1.58, 2.54, 3.52, 4.78, 5.76, 6.55, 7.31, 8.26, 9.24, 9.75, 10.48,
      11.94,
    ],
    cx: [
      0.02768, 0.02012, 0.01476, 0.01082, 0.0095, 0.00748, 0.00705, 0.00724,
      0.00906, 0.01204, 0.01345, 0.01824, 0.02142, 0.02565, 0.03265, 0.03824,
      0.0444, 0.05016, 0.05638, 0.06421, 0.06895, 0.07519, 0.08869,
    ],
    cz: [
      -0.59, -0.47, -0.36, -0.25, -0.2, -0.08, 0.03, 0.07, 0.2, 0.31, 0.35,
      0.46, 0.52, 0.58, 0.68, 0.75, 0.82, 0.88, 0.94, 1.01, 1.05, 1.1, 1.2,
    ],
    x_sa: 0.25,
    x_sc: 0.2,
    z_sa: 0.25,
    z_sc: 0.2,
    setCm0p: (value) => set((state) => ({ cm0p: value })),
    setAlfa: (value) => set((state) => ({ cx: value })),
    setCx: (value) => set((state) => ({ cx: value })),
    setCz: (value) => set((state) => ({ cz: value })),
    setX_sa: (value) => set((state) => ({ x_sa: value })),
    setX_sc: (value) => set((state) => ({ x_sc: value })),
    setZ_sa: (value) => set((state) => ({ z_sa: value })),
    setZ_sc: (value) => set((state) => ({ z_sc: value })),
  })
);

interface LongitudalMomentOutput {
  cmbu: Array<number>;
  setCmbu: (value: Array<number>) => void;
}

export const useLongitudalMomentOutput = create<LongitudalMomentOutput>()(
  (set) => ({
    cmbu: [
      -0.0807532857461385, -0.0945345227121025, -0.102714258593874,
      -0.110127943101989, -0.112569243098197, -0.115132605657143,
      -0.114335332495531, -0.113278573347122, -0.107322692745697,
      -0.0993260381430485, -0.0965167049212053, -0.0850503426553338,
      -0.0759065579031023, -0.0658892407401278, -0.0490582838887245,
      -0.0348659126336388, -0.021345456526302, -0.00800730551424755,
      0.0085219917637668, 0.027565202416483, 0.0383667575672632,
      0.0537179847324651, 0.0865250921182821,
    ],
    setCmbu: (value) => set((state) => ({ cmbu: value })),
  })
);

// interface Aero{

// }

// const useAero = create<Aero>()(

// );