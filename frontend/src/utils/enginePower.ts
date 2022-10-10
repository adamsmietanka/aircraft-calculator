import { density } from "./atmosphere";

export const powerFunction = (props: powerInput) => {
  let altitudes = altitudeArrayCreator(
    props.maxAltitude,
    props.halfSupercharger?.endAltitude,
    props.endSupercharger?.endAltitude,
    props.turbocharger?.altitude
  );

  let power = Array.from(altitudes, (altitude) =>
    powerArrayCreator(altitude, props)
  );
  return { x: altitudes, y: power };
};

interface powerInput {
  seaLevelPower: number;
  engineSpeed: number;
  reductionRatio: number;
  maxAltitude: number;
  kCoefficient: number;
  engineType: string;
  halfSupercharger?: { endAltitude: number; endPower: number };
  endSupercharger?: {
    startAltitude: number;
    endAltitude: number;
    endPower: number;
  };
  turbocharger?: {
    altitude: number;
  };
}

const altitudeArrayCreator = (
  maxAltitude: number,
  halfSuperchargerendAltitude?: number,
  endSuperchargerendAltitude?: number,
  turbocharger?: number
) => {
  let altitudes = Array.from(
    { length: Math.floor(maxAltitude / 100) },
    (_, i) => 100 * i
  );
  altitudes = [...altitudes, maxAltitude];

  if (
    halfSuperchargerendAltitude &&
    altitudes.includes(halfSuperchargerendAltitude) === false
  ) {
    altitudes = [...altitudes, halfSuperchargerendAltitude];
    altitudes.sort(function (a, b) {
      return a - b;
    });
  }

  if (
    endSuperchargerendAltitude &&
    altitudes.includes(endSuperchargerendAltitude) === false
  ) {
    altitudes = [...altitudes, endSuperchargerendAltitude];
    altitudes.sort(function (a, b) {
      return a - b;
    });
  }

  if (turbocharger && altitudes.includes(turbocharger) === false) {
    altitudes = [...altitudes, turbocharger];
    altitudes.sort(function (a, b) {
      return a - b;
    });
  }
  return altitudes;
};

const powerArrayCreator = (altitude: number, props: powerInput) => {
  let power = normalPower(altitude, 0, props.seaLevelPower, props.kCoefficient);

  if (props.engineType === "piston") {
    if (
      props.halfSupercharger &&
      altitude <= props.halfSupercharger.endAltitude
    ) {
      power = superchargerPower(
        altitude,
        0,
        props.halfSupercharger.endAltitude,
        props.seaLevelPower,
        props.halfSupercharger.endPower
      );
    } else if (
      props.halfSupercharger &&
      altitude > props.halfSupercharger.endAltitude
    ) {
      power = normalPower(
        altitude,
        props.halfSupercharger.endAltitude,
        props.halfSupercharger.endPower,
        props.kCoefficient
      );
    }

    if (
      props.halfSupercharger &&
      props.endSupercharger &&
      altitude >= props.endSupercharger.startAltitude &&
      altitude <= props.endSupercharger.endAltitude
    ) {
      let startPower = normalPower(
        props.endSupercharger.startAltitude,
        props.halfSupercharger.endAltitude,
        props.halfSupercharger.endPower,
        props.kCoefficient
      );
      power = superchargerPower(
        altitude,
        props.endSupercharger.startAltitude,
        props.endSupercharger.endAltitude,
        startPower,
        props.endSupercharger.endPower
      );
    } else if (
      props.endSupercharger &&
      altitude > props.endSupercharger.endAltitude
    ) {
      power = normalPower(
        altitude,
        props.endSupercharger.endAltitude,
        props.endSupercharger.endPower,
        props.kCoefficient
      );
    } else if (props.turbocharger)
      power = powerTurbocharged(
        props.turbocharger,
        props.seaLevelPower,
        altitude,
        props.kCoefficient
      );
  } else if (props.engineType === "turbine") {
    power = turbinePower(altitude, props.seaLevelPower);
  }

  return power;
};

function normalPower(
  altitude: number,
  startAltitude: number,
  startPower: number,
  kCoefficient: number
) {
  return (
    (startPower * (density(altitude) / density(startAltitude) - kCoefficient)) /
    (1 - kCoefficient)
  );
}

function turbinePower(altitude: number, seaLevelPower: number) {
  return seaLevelPower * (density(altitude) / density(0)) ** 0.6;
}

function superchargerPower(
  altitude: number,
  superchargerStartAltitude: number,
  superchargerEndAltitude: number,
  superchargerStartPower: number,
  superchargerEndPower: number
) {
  return (
    superchargerStartPower +
    ((superchargerEndPower - superchargerStartPower) /
      (superchargerEndAltitude - superchargerStartAltitude)) *
      (altitude - superchargerStartAltitude)
  );
}

function powerTurbocharged(
  turbocharger: {
    altitude: number;
  },
  seaLevelPower: number,
  altitude: number,
  kCoefficient: number
) {
  return altitude <= turbocharger.altitude
    ? seaLevelPower
    : normalPower(turbocharger.altitude, seaLevelPower, altitude, kCoefficient);
}
