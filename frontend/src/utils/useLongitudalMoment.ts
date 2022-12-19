import create from 'zustand'

interface LongitudalMomentState {
  //Fuselage
  s_b:number
  s_bf:number
  w:number
  l_b:number
  l_bf:number
  c_a:number
  i_w:number
  S:number
  c_0:number
  b_k:number
  setS_b:(value: number) => void
  setS_bf:(value: number) => void
  setW:(value: number) => void
  setL_b:(value: number) => void
  setL_bf:(value: number) => void
  setC_a:(value: number) => void
  setI_w:(value: number) => void
  setS:(value: number) => void
  setC0:(value: number) => void
  setb_k:(value: number) => void
  //Wing
  cm0p: number
  alfa: Array<number>
  cx: Array<number>
  cz: Array<number>
  x_sa:number,
  x_sc:number,
  z_sa:number,
  z_sc:number,
  setCm0p: (value: number) => void
  setAlfa: (value: Array<number>) => void
  setCx: (value: Array<number>) => void
  setCz: (value: Array<number>) => void
  setX_sc: (value: number) => void
  setX_sa: (value: number) => void
  setZ_sc: (value: number) => void
  setZ_sa: (value: number) => void
}

export const useLongitudalMomentStore = create<LongitudalMomentState>()((set) => ({
  //fuselage
  s_b:2000,
  s_bf:300,
  w:4,
  l_b:20,
  l_bf:7,
  c_a:3.4,
  i_w:1,
  S:20,
  c_0:4,
  b_k:12,
  setS_b:(value) => set((state) => ({ cm0p: value })),
  setS_bf:(value) =>set((state)=>({s_bf:value})),
  setW:(value) =>set((state)=>({w:value})),
  setL_b:(value) =>set((state)=>({l_b:value})),
  setL_bf:(value) =>set((state)=>({l_bf:value})),
  setC_a:(value) =>set((state)=>({c_a:value})),
  setI_w:(value) =>set((state)=>({i_w:value})),
  setS:(value) =>set((state)=>({S:value})),
  setC0:(value) =>set((state)=>({c_0:value})),
  setb_k:(value) =>set((state)=>({b_k:value})),
  //wing
  cm0p: 1000,
  alfa:[0],
  cx: [3000],
  cz: [0.4],
  x_sa:0.25,
  x_sc:0.2,
  z_sa:0.25,
  z_sc:0.2,
  setCm0p: (value) => set((state) => ({ cm0p: value })),
  setAlfa:(value) => set((state) => ({ cx: value })),
  setCx: (value) => set((state) => ({ cx: value })),
  setCz: (value) => set((state) => ({ cz: value })),
  setX_sa:(value) => set((state) => ({ x_sa: value })),
  setX_sc:(value) => set((state) => ({ x_sc: value })),
  setZ_sa:(value) => set((state) => ({ z_sa: value })),
  setZ_sc:(value) => set((state) => ({ z_sc: value })),
}))