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

export const stabilitySteps: Step[] = [
  {
    name: "Longitudinal Moment",
    path: "longitudal-moment",
    enabledPaths: ["longitudal-moment", "steer", "rod-force","stabillty-and-manouverabillty"],
    next: "steer",
  },
  {
    name: "Steer",
    path: "steer",
    enabledPaths: [ "steer", "rod-force","stabillty-and-manouverabillty"],
    previous: "longitudal-moment",
    next: "rod-force",
  },
  {
    name: "Force on a rod",
    path: "rod-force",
    enabledPaths: ["rod-force","stabillty-and-manouverabillty"],
    previous: "steer",
    next: "stabillty-and-manouverabillty",
  },
  {
    name: "Stabillty and manouverabillty",
    path: "stabillty-and-manouverabillty",
    enabledPaths: ["stabillty-and-manouverabillty"],
    previous: "rod-force",
  }
];