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

  it("creates elliptical section points", () => {
    const wing = new Wing({ ...config, shape: 2 }, "30");

    expect(wing.sectionPoints(0, 0.5)).toEqual([
      0, 0.1305261922200516, 0.2588190451025208, 0.3826834323650898, 0.5,
    ]);

    expect(wing.sectionPoints(0.2, 0.5)).toEqual([
      0.20000000000000004, 0.30388850196046313, 0.40427420378600176, 0.5,
    ]);

    expect(wing.sectionPoints(0.9, 1)).toEqual([
      0.9, 0.9551339695515183, 0.9887198717411111, 1,
    ]);

    expect(wing.sectionPoints(0, 1).length).toBe(11);
  });
});
