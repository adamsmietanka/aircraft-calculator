import React from "react";
import InputNumber from "../../../components/atoms/InputNumber";
import { useState, useEffect} from "react";
import { turnRadius } from "../../../utils/turnAnalisys/turnRadius";
const WingGeometry = () => {
  const [wingSpan, setWingSpan] = useState(0);
  const [wingArea, setWingArea] = useState(1);
  
  useEffect(()=>{
    let covergance = wingSpan*wingSpan/wingArea
    console.log("covergence: "+covergance)
  },[wingSpan,wingArea])

  return (
    <div className="flex flex-row">
      <div className="flex flex-col w-64 mr-8 space-y-2 ">

      <InputNumber
        label="Wing span"
        unit="m"
        value={wingSpan}
        setter={setWingSpan}
      />

      <InputNumber
        label="Wing area"
        unit="m^2"
        value={wingArea}
        setter={setWingArea}
      />
      </div>
    
    </div>
  );
};

export default WingGeometry;
