import create from "zustand";
import { CoG } from "../../utils/massCalculations";
import WeightComponent from "../../features/weight_distribution/interfaces/weightComponent";
import WeightConfiguration from "../../features/weight_distribution/interfaces/weightConfiguration";

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
  {
    componentName: "Froward Fuselage",
    mass: 59,
    cords: { x: 2, y: 0, z: 1.5 },
  },
  {
    componentName: "Center Fuselage",
    mass: 140,
    cords: { x: 5, y: 0, z: 1.7 },
  },
  { componentName: "Aft Fuselage", mass: 47, cords: { x: 7.5, y: 0, z: 1.8 } },
  {
    componentName: "Left Horizontal Stabilizer",
    mass: 16,
    cords: { x: 8.7, y: 1.1, z: 2 },
  },
  {
    componentName: "Right Horizontal Stabilizer",
    mass: 16,
    cords: { x: 8.7, y: -1.1, z: 2 },
  },
  {
    componentName: "Vertical Stabilizer",
    mass: 16,
    cords: { x: 8, y: 0, z: 3 },
  },
  { componentName: "Left Wing", mass: 121, cords: { x: 3.8, y: 2.6, z: 1.1 } },
  {
    componentName: "Right Wing",
    mass: 121,
    cords: { x: 3.8, y: -2.6, z: 1.1 },
  },
  {
    componentName: "Froward Landing Gear",
    mass: 32,
    cords: { x: 1.5, y: 0, z: 0.7 },
  },
  {
    componentName: "Left Landing Gear",
    mass: 53,
    cords: { x: 4.5, y: 0, z: 0.7 },
  },
  {
    componentName: "Right Landing Gear",
    mass: 53,
    cords: { x: 4.5, y: 0, z: 0.7 },
  },
  {
    componentName: "Left Engine",
    mass: 216,
    cords: { x: 3.8, y: 1.9, z: 1.4 },
  },
  {
    componentName: "Right Engine",
    mass: 216,
    cords: { x: 3.8, y: -1.9, z: 1.4 },
  },
  { componentName: "Fuel System", mass: 28, cords: { x: 4.5, y: 0, z: 1.1 } },
  { componentName: "Steering System", mass: 19, cords: { x: 4.5, y: 0, z: 1 } },
  {
    componentName: "Hydraulic System",
    mass: 65,
    cords: { x: 3.4, y: 0, z: 1.2 },
  },
  {
    componentName: "Electrical System",
    mass: 60,
    cords: { x: 3.2, y: 0, z: 1.2 },
  },
  { componentName: "Avionics", mass: 50, cords: { x: 2, y: 0, z: 1.4 } },
  { componentName: "Left Seats", mass: 45, cords: { x: 4, y: 0.3, z: 1.4 } },
  { componentName: "Right Seats", mass: 45, cords: { x: 4, y: -0.3, z: 1.4 } },
  {
    componentName: "Anti Ice and Oxygen System",
    mass: 60,
    cords: { x: 5, y: 0, z: 1.45 },
  },
];

const defaultComponents2 = [
  {
    componentName: "Froward Fuselage",
    mass: 59,
    cords: { x: 2, y: 0, z: 1.5 },
  },
  {
    componentName: "Center Fuselage",
    mass: 140,
    cords: { x: 5, y: 0, z: 1.7 },
  },
  { componentName: "Aft Fuselage", mass: 47, cords: { x: 7.5, y: 0, z: 1.8 } },
  {
    componentName: "Left Horizontal Stabilizer",
    mass: 16,
    cords: { x: 8.7, y: 1.1, z: 2 },
  },
  {
    componentName: "Right Horizontal Stabilizer",
    mass: 16,
    cords: { x: 8.7, y: -1.1, z: 2 },
  },
  {
    componentName: "Vertical Stabilizer",
    mass: 16,
    cords: { x: 8, y: 0, z: 3 },
  },
  { componentName: "Left Wing", mass: 121, cords: { x: 3.8, y: 2.6, z: 1.1 } },
  {
    componentName: "Right Wing",
    mass: 121,
    cords: { x: 3.8, y: -2.6, z: 1.1 },
  },
  {
    componentName: "Froward Landing Gear",
    mass: 32,
    cords: { x: 1.5, y: 0, z: 0.7 },
  },
  {
    componentName: "Left Landing Gear",
    mass: 53,
    cords: { x: 4.5, y: 0, z: 0.7 },
  },
  {
    componentName: "Right Landing Gear",
    mass: 53,
    cords: { x: 4.5, y: 0, z: 0.7 },
  },
  {
    componentName: "Left Engine",
    mass: 216,
    cords: { x: 3.8, y: 1.9, z: 1.4 },
  },
  {
    componentName: "Right Engine",
    mass: 216,
    cords: { x: 3.8, y: -1.9, z: 1.4 },
  },
  { componentName: "Fuel System", mass: 28, cords: { x: 4.5, y: 0, z: 1.1 } },
  { componentName: "Steering System", mass: 19, cords: { x: 4.5, y: 0, z: 1 } },
  {
    componentName: "Hydraulic System",
    mass: 65,
    cords: { x: 3.4, y: 0, z: 1.2 },
  },
  {
    componentName: "Electrical System",
    mass: 60,
    cords: { x: 3.2, y: 0, z: 1.2 },
  },
  { componentName: "Avionics", mass: 50, cords: { x: 2, y: 0, z: 1.4 } },
  { componentName: "Left Seats", mass: 45, cords: { x: 4, y: 0.3, z: 1.4 } },
  { componentName: "Right Seats", mass: 45, cords: { x: 4, y: -0.3, z: 1.4 } },
  {
    componentName: "Anti Ice and Oxygen System",
    mass: 60,
    cords: { x: 5, y: 0, z: 1.45 },
  },
  { componentName: "Fuel", mass: 60, cords: { x: 4.4, y: 0, z: 1.1 } },
];

const defaultConfigurations = [
  {
    name: "Default Configuration 1",
    components: defaultComponents1,
    MAC: 1.9,
    MACPosition: 3.2,
  },
  {
    name: "Default Configuration 2",
    components: defaultComponents2,
    MAC: 1.9,
    MACPosition: 3.2,
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
