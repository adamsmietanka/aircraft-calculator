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

