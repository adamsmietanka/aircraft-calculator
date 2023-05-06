export interface Step {
  name: string;
  path: string;
  enabledPaths: string[];
  previous?: string;
  next?: string;
}
export const powerUnitSteps: Step[] = [
  {
    name: "Engine",
    path: "engine",
    enabledPaths: ["results", "propeller", "engine"],
    next: "propeller",
  },
  {
    name: "Propeller",
    path: "propeller",
    enabledPaths: ["results", "propeller"],
    previous: "engine",
    next: "results",
  },
  {
    name: "Results",
    path: "results",
    enabledPaths: ["results"],
    previous: "propeller",
  },
];

export const performanceUnitSteps: Step[] = [
  {
    name: "Initial Data & Breguet Formulas Results",
    path: "initial_data",
    enabledPaths: ["sensitivity", "perf_extended", "initial_data"],
    next: "perf_extended",
  },
  {
    name: "Extended Algorithm",
    path: "perf_extended",
    enabledPaths: ["sensitivity", "perf_extended"],
    previous: "initial_data",
    next: "sensitivity",
  },
  {
    name: "Sensitivity Study",
    path: "sensitivity",
    enabledPaths: ["sensitivity"],
    previous: "perf_extended",
  },
];