import { Profile } from "./Profile";
import { ProfileFactory } from "./ProfileFactory";
import { ProfileFlat } from "./ProfileFlat";

describe("Profile creation", () => {
  beforeEach(() => {
    Profile.SEGMENTS = 25;
    ProfileFlat.SEGMENTS_V = 2;
  });

  it("creates a flat profile", () => {
    ProfileFlat.SEGMENTS_V = 1;
    Profile.SEGMENTS = 3;

    const profile = ProfileFactory.create("10");
    expect(profile.upper).toEqual([
      [0, 0, 0],
      [0, 0.05, 0],
      [1, 0.05, 0],
      [1, 0, 0],
    ]);
    expect(profile.upper.length).toBe(Profile.SEGMENTS + 1);
  });

  it("creates a NACA 2412 profile", () => {
    Profile.SEGMENTS = 2;

    const profile = ProfileFactory.create("2412");

    expect(profile.upper[1][0]).toBeCloseTo(0.5, 2);
    expect(profile.max[1][1] - profile.max[0][1]).toBeCloseTo(12 / 100, 4);

    expect(profile.upper.length - 1).toBe(Profile.SEGMENTS);
    expect(profile.points.length - 1).toBe(2 * Profile.SEGMENTS);
  });

  it("creates a NACA 2415 profile", () => {
    const profile = ProfileFactory.create("2415");
    expect(profile.max[1][1] - profile.max[0][1]).toBeCloseTo(15 / 100, 4);
  });

  it("transforms points", () => {
    const profile = ProfileFactory.create("10");

    expect(
      profile.transform(
        [
          [0, 0, 0],
          [0.5, 0.5, 0],
        ],
        0.1,
        1,
        2
      )
    ).toEqual([
      [0.1, 0, 1],
      [1.1, 1, 1],
    ]);
  });

  it("can get profile y at an arbitrary x", () => {
    let x = 0.5;

    const profileFlat = ProfileFactory.create("10");
    expect(profileFlat.getLowerUpper(x)[1][1]).toBe(0.05);

    const profile = ProfileFactory.create("2412");
    expect(profile.getLowerUpper(x)[1][0]).toBeCloseTo(x, 2);

    x = 0.8;
    expect(profile.getLowerUpper(x)[1][0]).toBeCloseTo(x, 2);
  });
});

describe("Flap creation", () => {
  beforeEach(() => {
    Profile.FLAP_LE_SEGMENTS = 8;
    Profile.SEGMENTS = 25;
    ProfileFlat.SEGMENTS_V = 2;
  });

  it("gets the outline of the wing without a flap", () => {
    ProfileFlat.SEGMENTS_V = 1;
    Profile.SEGMENTS = 4;

    const profile = ProfileFactory.create("10");

    expect(profile.getOutlineWithoutFlap()).toEqual([
      [0, 0, 0],
      [0, 0.05, 0],
      [0.5, 0.05, 0],
      [0.5, -0.05, 0],
      [0, -0.05, 0],
      [0, -0, 0],
    ]);
  });

  it("gets the leading edge of the flap", () => {
    Profile.FLAP_LE_SEGMENTS = 2;
    Profile.SEGMENTS = 4;
    ProfileFlat.SEGMENTS_V = 1;

    const profile = ProfileFactory.create("20");
    const leadingEdge = profile.getFlapLE(0.5);

    expect(leadingEdge[0][0]).toBe(0.4);
    expect(leadingEdge[0][1]).toBeCloseTo(0, 5);
    expect(leadingEdge.length).toBe(1);
  });

  it("gets the flap outline", () => {
    Profile.FLAP_LE_SEGMENTS = 2;
    Profile.SEGMENTS = 6;
    ProfileFlat.SEGMENTS_V = 1;

    const profile = ProfileFactory.create("20");
    expect(profile.getOutlineFlap()).toEqual([
      [1, -0, 0],
      [1, -0.1, 0],
      [0.75, -0.1, 0],
      [0.65, -6.123233995736766e-18, 0],
      [0.75, 0.1, 0],
      [1, 0.1, 0],
      [1, 0, 0],
    ]);
  });
});
