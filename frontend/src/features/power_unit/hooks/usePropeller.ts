import { useEngineStore } from "../stores/useEngine";
import { usePropellerStore } from "../stores/usePropeller";
import { usePower } from "./usePower";
import { usePropellerInterpolation } from "./usePropellerInterpolation";

export const usePropeller = () => {
  const engineSpeed = useEngineStore((state) => state.engineSpeed);
  const reductionRatio = useEngineStore((state) => state.reductionRatio);
  const cruiseSpeed = usePropellerStore((state) => state.cruiseSpeed);
  const cruiseAltitude = usePropellerStore((state) => state.cruiseAltitude);
  const diameter = usePropellerStore((state) => state.diameter);

  const [interpolateJ] = usePropellerInterpolation();

  const [calculatePower] = usePower();
  const power = calculatePower(cruiseAltitude);
  const density = 1.2255 * (1 - cruiseAltitude / 44.3) ** 4.256;
  const propellerSpeed = (engineSpeed * reductionRatio) / 60;
  const Cn =
    cruiseSpeed * (density / (power * 1000 * propellerSpeed ** 2)) ** 0.2;
  const J = interpolateJ(Cn);
  const computedDiameter = cruiseSpeed / (J * propellerSpeed);
  const soundSpeed = 340.3 * ((288.15 - 6.5 * cruiseAltitude) / 288) ** 0.5;

  const machTip = () => {
    const rotationSpeed = Math.PI * propellerSpeed * diameter;
    const forwardSpeed = 1.2 * cruiseSpeed;
    const a = Math.hypot(forwardSpeed, rotationSpeed) / soundSpeed;
    return parseFloat(a.toFixed(3));
  };

  return {
    power: Math.round(power * 100) / 100,
    propellerSpeed: Math.round(propellerSpeed * 60 * 100) / 100,
    Cn: Math.round(Cn * 10000) / 10000,
    J: Math.round(J * 10000) / 10000,
    computedDiameter,
    machTip: machTip(),
  };
};
