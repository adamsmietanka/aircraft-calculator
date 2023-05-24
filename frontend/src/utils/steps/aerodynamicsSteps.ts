export interface Step {
    name: string;
    path: string;
    enabledPaths: string[];
    previous?: string;
    next?: string;
  }
  export const aerodynamicsSteps: Step[] = [
    {
      name: "Wing Geometry",
      path: "wing-geometry",
      enabledPaths: ["fuselage", "wing-aerodynamics", "wing-geometry"],
      next: "wing-aerodynamics",
    },
    {
      name: "Wing aerodynamics",
      path: "wing-aerodynamics",
      enabledPaths: ["fuselage", "wing-aerodynamics"],
      previous: "wing-geometry",
      next: "fuselage",
    },
    {
      name: "Fuselage",
      path: "fuselage",
      enabledPaths: ["fuselage"],
      previous: "wing-aerodynamics",
    },
  ];