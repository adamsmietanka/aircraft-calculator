import { produce } from "immer";
import { create } from "zustand";

interface NavigationState {
  routes: Record<string, string>;
  tutorials: Record<string, boolean>;
  setRoute: (route: string, subroute: string) => void;
  setTutorialSeen: (path: string) => void;
}

export const useNavigationStore = create<NavigationState>()((set) => ({
  routes: {
    aerodynamics: "profile",
    powerunit: "engine",
    stability: "longitudinal-moment",
  },
  tutorials: {},
  setRoute: (route, subroute) =>
    set(
      produce((state) => {
        state.routes[route] = subroute;
      })
    ),
  setTutorialSeen: (path) =>
    set(
      produce((state) => {
        state.tutorials[path] = true;
      })
    ),
}));
