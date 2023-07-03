import create from "zustand";
import { useCallback } from "react";

export function createVelocitiesArray(veloMax: number, veloMin: number, elements = 100) {
  var array = [];
  var step = (veloMax - veloMin) / (elements - 1);
  for (var i = 0; i < elements; i++){
    array.push(veloMin + (step * i));
  }
  return array
}

interface InitialState {
  method_type: 'breguet'
  proptype: string;
  propnumber: number;
  flightAltitude: number;
  nominalPower: number;
  startMass: number;
  fuelMass: number;
  fuelcons: number;
  vmax: number;
  wmax: number;
  area: number;
  aspectRatio: number;
  cx0: number;
  czmax: number;
  velocities: number[];
  setProptype: (value: string) => void;
  setPropnumber: (value: number) => void;
  setFlightAltitude: (value: number) => void;
  setNominalPower: (value: number) => void;
  setStartMass: (value: number) => void;
  setFuelMass: (value: number) => void;
  setFuelcons: (value: number) => void;
  setVmax: (value: number) => void;
  setWmax: (value: number) => void;
  setArea: (value: number) => void;
  setAspectRatio: (value: number) => void;
  setCx0: (value: number) => void;
  setCzmax: (value: number) => void;
  setVelocities: (value: number[]) => void;
}

export const useInitialStore = create<InitialState>()((set) => ({
  method_type: 'breguet',
  proptype: 'propeller-breguet',
  propnumber: 1,
  flightAltitude: 0,
  nominalPower: 74.6,
  startMass: 727.75,
  fuelMass: 71,
  fuelcons: 0.267,
  vmax: 54.98,
  wmax: 2.88,
  area: 14.865,
  aspectRatio: 2.855,
  cx0: 0.0269,
  czmax: 1.156,
  velocities: createVelocitiesArray(54.98, 25, 50),
  setProptype: (value) => set((state) => ({ proptype: value })),
  setPropnumber: (value) => set((state) => ({ propnumber: value })),
  setFlightAltitude: (value) => set((state) => ({ flightAltitude: value })),
  setNominalPower: (value) => set((state) => ({ nominalPower: value })),
  setStartMass: (value) => set((state) => ({ startMass: value })),
  setFuelMass: (value) => set((state) => ({ fuelMass: value })),
  setFuelcons: (value) => set((state) => ({ fuelcons: value })),
  setWmax: (value) => set((state) => ({ wmax: value })),
  setArea: (value) => set((state) => ({ area: value })),
  setAspectRatio: (value) => set((state) => ({ aspectRatio: value })),
  setCx0: (value) => set((state) => ({ cx0: value })),
  setCzmax: (value) => set((state) => ({ czmax: value })),
  setVmax: (value) => set((state) => ({
    vmax: value,
    velocities: createVelocitiesArray(value, 25, 50)})),
  setVelocities: (value) => set((state) => ({ velocities: value })),
}));