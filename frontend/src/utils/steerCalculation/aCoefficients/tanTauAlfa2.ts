//Equation to estimate tan(tau_a/2) requried to get a10T and a1_0/a10T ratio
//y99 - profile relative thicness at 90% chord [-]
//y90 - profile relative thckness at 99% chord [-]
const tanTauAlfa2 = (y90: number, y99: number) => {
  return (y90 - y99) / 0.18;
};
export default tanTauAlfa2;
