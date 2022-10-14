import create from "zustand";

interface WegihtComponent {
  componentName: string;
  mass: number;
  cords: { x: number; y: number; z: number };
}

interface WeightConfigurationsState {
  weightConfigurations: Array<
    { name: string; components: Array<WegihtComponent>; enabled: boolean }>
  ;
  setWeightConfigurations: (
    value: Array<{ name: string; components: Array<WegihtComponent>; enabled: boolean }>
  ) => void;
}

const defaultComponents1 = [
  { componentName: "Fuselage", mass: 900, cords: { x: 0, y: 0, z: 0 } },
  { componentName: "Wing", mass: 900, cords: { x: 0, y: 0, z: 0 } }
];

const defaultComponents2 = [
  { componentName: "Fuselage", mass: 900, cords: { x: 0, y: 0, z: 0 } },
  { componentName: "Wing", mass: 900, cords: { x: 0, y: 0, z: 0 } },
  { componentName: "Rudder", mass: 900, cords: { x: 0, y: 0, z: 0 } }
];

const defaultConfigurations = [
  {
    name: "Default Configuration 1",
    components: defaultComponents1,
    enabled: true,
  },
  {
    name: "Default Configuration 2",
    components: defaultComponents2,
    enabled: false,
  },
]

export const useWeightStore = create<WeightConfigurationsState>()((set) => ({
  weightConfigurations: defaultConfigurations,
  setWeightConfigurations: (value) =>
    set((state) => ({ weightConfigurations: value })),
}));
