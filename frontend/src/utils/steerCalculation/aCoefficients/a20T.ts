const a20T = (profileThickness: number, chordRatio: number) => {
  return (
    (10.81508606 * profileThickness + 2.73825874) *
    Math.log(
      (-44.95742571 * profileThickness + 11.01818345) * chordRatio +
        (-0.90731198 * profileThickness + 1.43220827)
    )
  );
};

export default a20T;
