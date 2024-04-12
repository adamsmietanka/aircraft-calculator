import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Profile } from "../utils/wing/Profile";
import { ProfileFlat } from "../utils/wing/ProfileFlat";

export interface ProfileState {
  prof: Profile;
  set: (value: Partial<ProfileState>) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      prof: new ProfileFlat("10"),
      set: (value) => set(value),
    }),
    { name: "Profile" }
  )
);
