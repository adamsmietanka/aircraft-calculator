export interface Step {
  name: string;
  feature: string;
  path?: string;
  symbol?: string;
  tutorial?: boolean;
}

export const whitelist = ["/", "aerodynamics", "powerunit"];

const stepsList: Step[] = [
  {
    name: "Home",
    feature: "/",
  },
  // Aero
  {
    name: "Introduction",
    feature: "aerodynamics",
    path: "introduction",
    tutorial: true,
    symbol: "0",
  },
  {
    name: "Profile",
    feature: "aerodynamics",
    path: "profile",
  },
  {
    name: "Level Flight",
    feature: "aerodynamics",
    path: "levelFlight",
    tutorial: true,
    symbol: "1a",
  },
  {
    name: "Induced Drag",
    feature: "aerodynamics",
    path: "inducedDrag",
    tutorial: true,
    symbol: "1b",
  },
  {
    name: "Wing",
    feature: "aerodynamics",
    path: "wing",
  },
  {
    name: "Fuselage",
    feature: "aerodynamics",
    path: "fuselage",
  },
  // {
  //   name: "Shapes",
  //   feature: "aerodynamics",
  //   path: "shapes",
  // },
  // {
  //   name: "Stabilizers",
  //   feature: "aerodynamics",
  //   path: "stabilizers",
  // },
  // Engine
  {
    name: "Engine",
    feature: "powerunit",
    path: "engine",
  },
  {
    name: "Propeller",
    feature: "powerunit",
    path: "propeller",
  },
  {
    name: "Results",
    feature: "powerunit",
    path: "results",
  },
  // Performance
  {
    name: "Performance",
    feature: "performance",
    path: "",
  },
  {
    name: "Mass Distribution",
    feature: "weight",
    path: "",
  },
  {
    name: "Longitudinal Moment",
    feature: "stability",
    path: "longitudinal-moment",
  },
  {
    name: "Steer",
    feature: "stability",
    path: "steer",
  },
  {
    name: "Force on a rod",
    feature: "stability",
    path: "rod-force",
  },
  {
    name: "Stabillty and manouverabillty",
    feature: "stability",
    path: "stabillty-and-manouverabillty",
  },
  {
    name: "Turn",
    feature: "turn",
    path: "",
  },
  {
    name: "Hyperbolic navigation",
    feature: "navigation",
    path: "hyperbolic",
  },
];

const steps: Step[] = import.meta.env.PROD
  ? stepsList.filter((s) => whitelist.includes(s.feature))
  : stepsList;

export default steps;
