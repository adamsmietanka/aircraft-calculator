import create from "zustand";

interface ReservesOfStabillityState {
  hN: number[];
  hNprim: number[];
  hM: number[];
  hMprim: number[];
  setHn: (value: number[]) => void;
  setHnPrim: (value: number[]) => void;
  setHm: (value: number[]) => void;
  setHmprim: (value: number[]) => void;
}

export const useReservesOfStabillityStore = create<ReservesOfStabillityState>()((set) => ({
  hN: [
    0.989103789154756, 0.961775208669327, 0.936724009891017, 0.911672811112706,
    0.900285902577111, 0.872957322091681, 0.847906123313371, 0.838796596484894,
    0.809190634292346, 0.784139435514035, 0.775029908685559, 0.749978709907249,
    0.736314419664534, 0.722650129421819, 0.699876312350628, 0.683934640400794,
    0.66799296845096, 0.654328678208245, 0.640664387965531, 0.624722716015697,
    0.61561318918722, 0.604226280651624, 0.581452463580433,
  ],
  hNprim: [
    0.911169792831087, 0.88359372789559, 0.858315668371384, 0.833037608847178,
    0.821547581790721, 0.793971516855224, 0.768693457331018, 0.759501435685852,
    0.729627365339063, 0.704349305814857, 0.695157284169691, 0.669879224645485,
    0.656091192177737, 0.642303159709988, 0.619323105597073, 0.603237067718033,
    0.587151029838993, 0.573362997371244, 0.559574964903496, 0.543488927024456,
    0.53429690537929, 0.522806878322832, 0.499826824209918,
  ],
  hM: [
    1.02366287297514, 0.996582284203652, 0.971758411163119, 0.946934538122586,
    0.935650959467799, 0.908570370696309, 0.883746497655776, 0.874719634731946,
    0.845382330229499, 0.820558457188966, 0.811531594265136, 0.786707721224604,
    0.773167426838859, 0.759627132453114, 0.737059975143539, 0.721262965026836,
    0.705465954910134, 0.691925660524389, 0.678385366138644, 0.662588356021941,
    0.653561493098111, 0.642277914443324, 0.619710757133749,
  ],
  hMprim: [
    0.941954954698157, 0.914597330702425, 0.889519508706338, 0.864441686710252,
    0.853042676712031, 0.825685052716299, 0.800607230720212, 0.791488022721635,
    0.76185059672626, 0.736772774730173, 0.727653566731596, 0.702575744735509,
    0.688896932737644, 0.675218120739778, 0.652420100743336, 0.636461486745826,
    0.620502872748316, 0.606824060750451, 0.593145248752585, 0.577186634755075,
    0.568067426756498, 0.556668416758277, 0.533870396761834,
  ],
  setHn: (value) => set((state) => ({ hN: value })),
  setHnPrim: (value) => set((state) => ({ hNprim: value })),
  setHm: (value) => set((state) => ({ hM: value })),
  setHmprim: (value) => set((state) => ({ hMprim: value })),
}));