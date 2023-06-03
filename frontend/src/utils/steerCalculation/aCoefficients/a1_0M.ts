import { degTorad } from "../../misc";

const a1_0M = (a10: number, machNumber: number, effectiveWingSweep: number) => {
  return (
    a10 / Math.sqrt(1 - Math.pow(machNumber * Math.cos(degTorad(effectiveWingSweep)), 2))
  );
};

export default a1_0M;
