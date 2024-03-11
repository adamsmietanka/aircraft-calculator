import { Wing } from "./Wing";

jest.mock("three/examples/jsm/utils/BufferGeometryUtils", () => {});

const config = {
  span: 2,
  chord: 1,
  chordTip: 1,
  angle: 0,
  shape: 0,
};

describe("Wing creation", () => {
  it("creates section points", () => {
    const wing = new Wing(config, "30");

    expect(wing.sectionPoints(0, 0.4)).toEqual([
      0, 0.1, 0.2, 0.30000000000000004, 0.4,
    ]);

    expect(wing.sectionPoints(0.4, 0.9)).toEqual([
      0.4, 0.5, 0.6000000000000001, 0.7000000000000001, 0.8, 0.9,
    ]);

    expect(wing.sectionPoints(0.95, 1)).toEqual([0.95, 1]);
  });
});
