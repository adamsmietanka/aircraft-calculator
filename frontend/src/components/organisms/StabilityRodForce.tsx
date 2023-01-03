import React, { useEffect, useState } from "react";
import {
  forceOnTheRodCaclculation,
  heightSteerHingeMomentCalculation,
} from "../../utils/forceOnTheRodCalculation";
import {
  useForceOnTheRodOutputStore,
  useForceOnTheRodStore,
} from "../../utils/useForceOnTheRod";

import { useSteerOutputStore, useSteerStore } from "../../utils/useSteer";
import RadioOptions from "../atoms/RadioOptions";
import StabillityForceOnTheRodChart from "../molecules/StabillityForceOnTheRodChart";
import StabillityForceOnTheRodHingeMoment from "../molecules/StabillityForceOnTheRodHingeMoment";
import StabillityForceOnTheRodTrimCooficientDataCollapse from "../molecules/StabillityForceOnTheRodTrimCooficientDataCollapse";

const StabilityRodForce = () => {
  //forceOnTheRodCaclculation
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

  //heightSteerHingeMomentCalculation
  const setHeightSteerHingeMoment = useForceOnTheRodOutputStore(
    (state) => state.setHeightSteerHingeMoment
  );
  const b1 = useForceOnTheRodOutputStore((state) => state.b1);
  const b2 = useForceOnTheRodOutputStore((state) => state.b2);
  const b3 = useForceOnTheRodOutputStore((state) => state.b3);
  const deltaHk = useForceOnTheRodOutputStore((state) => state.deltaHk);
  const deltaH = useSteerOutputStore((state)=> state.delta)
  const alfaH = useSteerOutputStore((state)=> state.alfaH)
  const [optionChosen, setOptionChosen] = useState("Trim");

  useEffect(() => {
    switch (optionChosen) {
      case "trim":
        setHeightSteerHingeMoment(
          heightSteerHingeMomentCalculation({
            b1,
            alfaH,
            b2,
            deltaH,
            b3,
            deltaHk,
          })
        );
        break;
        case "No Trim":
          setHeightSteerHingeMoment(
            heightSteerHingeMomentCalculation({
              b1,
              alfaH,
              b2,
              deltaH,
            })
          );
          break;
    }
    console.log("Height steer hinge moment: "+ heightSteerHingeMoment)
  }, [b1, alfaH, b2, deltaH, b3, deltaHk,optionChosen]);

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
  }, [
    setForceOnTheRod,
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
