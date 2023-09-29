export interface Step {
  name: string;
  symbol?: string | number;
  feature: string;
  path?: string;
  tutorial?: boolean;
}
const steps: Step[] = [
  {
    name: "Home",
    feature: "/",
  },
  {
    name: "Introduction",
    symbol: "?",
    feature: "aerodynamics",
    path: "introduction",
    tutorial: true,
  },
  {
    name: "Profile",
    symbol: 1,
    feature: "aerodynamics",
    path: "profile",
  },
  {
    name: "Induced Drag",
    symbol: "?",
    feature: "aerodynamics",
    path: "inducedDrag",
    tutorial: true,
  },
  {
    name: "Wing",
    symbol: 2,
    feature: "aerodynamics",
    path: "wing",
  },
  {
    name: "Fuselage",
    symbol: 3,
    feature: "aerodynamics",
    path: "fuselage",
  },
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
];

export default steps;
