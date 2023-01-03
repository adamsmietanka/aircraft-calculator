import React, { useEffect, useState } from "react";
import { forceOnTheRodCaclculation } from "../../utils/forceOnTheRodCalculation";
import {
  useForceOnTheRodOutputStore,
  useForceOnTheRodStore,
} from "../../utils/useForceOnTheRod";

import { useSteerStore } from "../../utils/useSteer";
import RadioOptions from "../atoms/RadioOptions";
import StabillityForceOnTheRodChart from "../molecules/StabillityForceOnTheRodChart";
import StabillityForceOnTheRodHingeMoment from "../molecules/StabillityForceOnTheRodHingeMoment";
import StabillityForceOnTheRodTrimCooficientDataCollapse from "../molecules/StabillityForceOnTheRodTrimCooficientDataCollapse";

const StabilityRodForce = () => {
  const setForceOnTheRod = useForceOnTheRodOutputStore(
    (state) => state.setForceOnTheRod
  );
  const height = useForceOnTheRodStore((state) => state.height);
  const steerArea = useSteerStore((state) => state.sh);
  const steerCord = useForceOnTheRodStore((state) => state.steerCord);
  const rodLenght = useForceOnTheRodStore((state) => state.rodLenght);
  const angularRudderToSteeringGearRatio = useForceOnTheRodStore(
    (state) => state.angularRudderToSteeringGearRatio
  );
  const heightSteerHingeMoment = useForceOnTheRodOutputStore(
    (state) => state.heightSteerHingeMoment
  );
  const velocity = useForceOnTheRodStore((state) => state.velocity);
  const velocityRatio = useSteerStore((state) => state.speedDifference);

  const [optionChosen, setOptionChosen] = useState("Trim");
  useEffect(() => {
    setForceOnTheRod(
      forceOnTheRodCaclculation({
        height,
        steerArea,
        steerCord,
        rodLenght,
        angularRudderToSteeringGearRatio,
        heightSteerHingeMoment,
        velocity,
        velocityRatio,
      })
    );
  }, [setForceOnTheRod,
    height,
    steerArea,
    steerCord,
    rodLenght,
    angularRudderToSteeringGearRatio,
    heightSteerHingeMoment,
    velocity,
    velocityRatio,
  ]);
  return (
    <div className="flex flex-row">
      <div className="flex flex-col w-80 mr-8 space-y-2">
        <RadioOptions
          options={["No Trim", "Trim"]}
          checkedButton={optionChosen}
          setCheckedButton={setOptionChosen}
        />
        <StabillityForceOnTheRodHingeMoment />
        {optionChosen === "Trim" && (
          <StabillityForceOnTheRodTrimCooficientDataCollapse />
        )}
      </div>
      <StabillityForceOnTheRodChart />
    </div>
  );
};

export default StabilityRodForce;
