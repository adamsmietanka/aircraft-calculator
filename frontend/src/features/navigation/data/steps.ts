export interface Step {
  name: string;
  feature: string;
  path: string;
}
const steps: Step[] = [
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
    name: "Range & Endurance",
    feature: "performance",
    path: "initial_data",
  },
  {
    name: "Extended Algorithm",
    feature: "performance",
    path: "perf_extended",
  },
  {
    name: "Sensitivity",
    feature: "performance",
    path: "sensitivity",
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
