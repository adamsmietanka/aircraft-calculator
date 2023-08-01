import { produce } from "immer";
import { create } from "zustand";

interface NavigationState {
  routes: Record<string, string>;
  setRoute: (route: string, subroute: string) => void;
}

export const useNavigationStore = create<NavigationState>()((set) => ({
  routes: {
    aerodynamics: "profile",
    powerunit: "engine",
    stability: "longitudinal-moment",
  },
  setRoute: (route, subroute) =>
    set(
      produce((state) => {
        state.routes[route] = subroute;
      })
    ),
}));
