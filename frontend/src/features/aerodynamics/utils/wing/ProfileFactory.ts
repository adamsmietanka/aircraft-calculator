import { Profile } from "./Profile";
import { Profile4Series } from "./Profile4Series";
import { Profile5Series } from "./Profile5Series";
import { Profile63Series } from "./Profile63Series";
import { Profile64Series } from "./Profile64Series";
import { Profile65Series } from "./Profile65Series";
import { ProfileFlat } from "./ProfileFlat";

export class ProfileFactory {
  
  static get6Series(name: string): Profile {
    switch (name[1]) {
      case "3":
        return new Profile63Series(name);
      case "4":
        return new Profile64Series(name);
      default:
        return new Profile65Series(name);
    }
  }

  public static create(name: string): Profile {
    if (name.length == 2) {
      return new ProfileFlat(name);
    } else if (name.length == 4) {
      return new Profile4Series(name);
    } else if (name.length == 5) {
      return new Profile5Series(name);
    } else {
      return ProfileFactory.get6Series(name);
    }
  }
}
