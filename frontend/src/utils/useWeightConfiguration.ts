import create from "zustand";

interface WeightComponent {
  componentName: string;
  mass: number;
  cords: { x: number; y: number; z: number };
}

interface WeightConfigurationsState {
  weightConfigurations: Array<{
    name: string;
    components: Array<WeightComponent>;
  }>;
  activeWeightConfiguration: {
    name: string;
    components: Array<WeightComponent>;
  };
  setWeightConfigurations: (
    value: Array<{
      name: string;
      components: Array<WeightComponent>;
    }>
  ) => void;
  setActiveWeightConfiguration: (value: {
    name: string;
    components: Array<WeightComponent>;
  }) => void;
}

const defaultComponents1 = [
  { componentName: "Fuselage", mass: 900, cords: { x: 0, y: 0, z: 0 } },
  { componentName: "Wing", mass: 900, cords: { x: 0, y: 0, z: 0 } },
];

const defaultComponents2 = [
  { componentName: "Fuselage", mass: 900, cords: { x: 0, y: 0, z: 0 } },
  { componentName: "Wing", mass: 900, cords: { x: 0, y: 0, z: 0 } },
  { componentName: "Rudder", mass: 900, cords: { x: 0, y: 0, z: 0 } },
];

const defaultConfigurations = [
  {
    name: "Default Configuration 1",
    components: defaultComponents1,
  },
  {
    name: "Default Configuration 2",
    components: defaultComponents2,
  },
];

export const useWeightStore = create<WeightConfigurationsState>()((set) => ({
  weightConfigurations: defaultConfigurations,
  activeWeightConfiguration: defaultConfigurations[0],
  setWeightConfigurations: (value) =>
    set((state) => ({ weightConfigurations: value })),
  setActiveWeightConfiguration: (value) =>
    set((state) => ({ activeWeightConfiguration: value })),
}));
