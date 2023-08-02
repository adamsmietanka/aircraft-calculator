// TODO: fix floating point precision error
const round = (number: number, step: number) =>
  parseFloat((Math.ceil(number / step) * step).toFixed(7));

export default round;
