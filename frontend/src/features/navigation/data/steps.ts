export interface Step {
  name: string;
  feature: string;
  path?: string;
}
const steps: Step[] = [
  {
    name: "Home",
    feature: "/",
  },
  {
    name: "Profile",
    feature: "aerodynamics",
    path: "profile",
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
