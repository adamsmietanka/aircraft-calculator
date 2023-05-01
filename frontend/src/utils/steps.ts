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
    name: "Initial Data",
    path: "initial_data",
    enabledPaths: ["perf_extended", "breguet", "initial_data"],
    next: "breguet",
  },
  {
    name: "Breguet Formulas",
    path: "breguet",
    enabledPaths: ["perf_extended", "breguet"],
    previous: "initial_data",
    next: "perf_extended",
  },
  {
    name: "Extended Algorithm",
    path: "perf_extended",
    enabledPaths: ["perf_extended"],
    previous: "breguet",
  },
];