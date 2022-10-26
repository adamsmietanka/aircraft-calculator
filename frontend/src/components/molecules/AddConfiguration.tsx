import React, { useState } from "react";
import { useWeightStore } from "../../utils/useWeightConfiguration";
import RadioOptions from "../atoms/RadioOptions";

const radioButtonsText = [
  "Empty Configuration",
  "Clone from the configuration",
  "Load from computer",
];

const AddConfiguration = () => {
  const [name, setName] = useState("");
  const [weightComponents, setWeightComponents] = useState([]);
  const [checkedButton, setCheckedButton] = useState(radioButtonsText[0]);

  const weightConfigurations = useWeightStore(
    (state) => state.weightConfigurations
  );
  const activeWeightConfiguration = useWeightStore(
    (state) => state.activeWeightConfiguration
  );
  const setWeightConfigurations = useWeightStore(
    (state) => state.setWeightConfigurations
  );
  const setAcitveWeightConfiguration = useWeightStore(
    (state) => state.setActiveWeightConfiguration
  );

  const handleSubmit = () => {
    let configurations = [];
    configurations = weightConfigurations;
    let newConfuguration = { name: name, components: weightComponents };
    
    configurations.push(newConfuguration);
    setWeightConfigurations(configurations);
    console.log(weightConfigurations);
    setAcitveWeightConfiguration(newConfuguration);
    console.log(activeWeightConfiguration);
  };
  
  return (
    <div className="flex flex-col">
      <input type="checkbox" id="add-config" className="modal-toggle " />
      <div className="modal ">
        <div className="modal-box w-80">
          <label className="label">
            <span>Crete new configuration:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-60 mb-2"
            placeholder="Input configuration name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>

          <RadioOptions options={radioButtonsText}  checkedButton= {checkedButton} setCheckedButton = {setCheckedButton}/>

          {checkedButton === "Clone from the configuration" && (
            <select className="select select-bordered w-60 max-w-xs">
              {weightConfigurations &&
                weightConfigurations.map((config) => (
                  <option>{config.name}</option>
                ))}
            </select>
          )}

          {checkedButton === "Load from computer" && (
            "The option is not aviable yet"
          )}

          <div className="modal-action">
            <label
              htmlFor="add-config"
              className="btn"
              onClick={() => handleSubmit()}
            >
              Submit
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddConfiguration;
