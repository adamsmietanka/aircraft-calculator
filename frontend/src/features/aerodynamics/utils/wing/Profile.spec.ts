import { Profile4Series } from "./Profile4Series";
import { ProfileFactory } from "./ProfileFactory";
import { ProfileFlat } from "./ProfileFlat";

describe("Profile creation", () => {
  it("creates a flat profile", () => {
    ProfileFlat.SEGMENTS_V = 1;
    ProfileFlat.SEGMENTS = 3;

    const profile = ProfileFactory.createProfile("10");
    expect(profile.upper).toEqual([
      [0, 0, 0],
      [0, 0.05, 0],
      [1, 0.05, 0],
      [1, 0, 0],
    ]);
    expect(profile.upper.length).toBe(ProfileFlat.SEGMENTS + 1);
  });

  it("creates a NACA profile", () => {
    Profile4Series.SEGMENTS = 2;

    const profile = ProfileFactory.createProfile("2412");
    
    expect(profile.upper[1][0]).toBeCloseTo(0.5, 2);
    expect(profile.max[1][1] - profile.max[0][1]).toBeCloseTo(12 / 100, 4);

    expect(profile.upper.length - 1).toBe(Profile4Series.SEGMENTS);
    expect(profile.points.length - 1).toBe(2 * Profile4Series.SEGMENTS);
  });
});
