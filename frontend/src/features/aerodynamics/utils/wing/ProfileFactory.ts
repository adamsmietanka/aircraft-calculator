import { Profile } from "./Profile";
import { Profile4Series } from "./Profile4Series";
import { Profile5Series } from "./Profile5Series";
import { ProfileFlat } from "./ProfileFlat";

export class ProfileFactory {
  public static create(name: string): Profile {
    if (name.length == 2) {
      return new ProfileFlat(name);
    } else if (name.length == 4) {
      return new Profile4Series(name);
    } else {
      return new Profile5Series(name);
    }
  }
}
