import { ProfilePoints } from "./Profile";
import { Profile4Series } from "./Profile4Series";
import { ProfileFlat } from "./ProfileFlat";

export class ProfileFactory {
  public static createProfile(name: string): ProfilePoints {
    if (name.length == 2) {
      return new ProfileFlat(name);
    } else {
      return new Profile4Series(name);
    }
  }
}
