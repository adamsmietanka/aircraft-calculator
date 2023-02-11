import create from "zustand";
import { CoG } from "../../utils/massCalculations";
import WeightComponent from "../../pages/weightDistribution/interfaces/weightComponent";
import WeightConfiguration from "../../pages/weightDistribution/interfaces/weightConfiguration";

interface WeightConfigurationsState {
  useType: string;
  editedComponent: WeightComponent;
  weightConfigurations: Array<WeightConfiguration>;
  activeWeightConfiguration: WeightConfiguration;
  cog: { x: number; y: number; z: number };
  setUseType: (value: string) => void;
  setEditedComponent: (value: WeightComponent) => void;
  setWeightConfigurations: (value: WeightConfiguration[]) => void;
  setActiveWeightConfiguration: (value: WeightConfiguration) => void;
  setCog: (value: { x: number; y: number; z: number }) => void;
}

const defaultComponents1 = [
  { componentName: "Fuselage", mass: 900, cords: { x: 10, y: 0, z: 2 } },
  { componentName: "Wing", mass: 900, cords: { x: 10.5, y: -2, z: 1 } },
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
    MAC: 1.9,
    MACPosition: 14,
  },
  {
    name: "Default Configuration 2",
    components: defaultComponents2,
    MAC: 1.9,
    MACPosition: 14,
  },
];

export const useWeightStore = create<WeightConfigurationsState>()((set) => ({
  useType: "add",
  editedComponent: {
    componentName: "Fuselage",
    mass: 900,
    cords: { x: 0, y: 0, z: 0 },
  },
  weightConfigurations: defaultConfigurations,
  activeWeightConfiguration: defaultConfigurations[0],
  cog: CoG(defaultComponents1),
  setUseType: (value) => set((state) => ({ useType: value })),
  setEditedComponent: (value) => set((state) => ({ editedComponent: value })),
  setWeightConfigurations: (value) =>
    set((state) => ({ weightConfigurations: value })),
  setActiveWeightConfiguration: (value) =>
    set((state) => ({ activeWeightConfiguration: value })),
  setCog: (value) => set((state) => ({ cog: value })),
}));
