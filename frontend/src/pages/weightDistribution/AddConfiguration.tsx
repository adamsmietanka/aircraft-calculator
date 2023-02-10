import React, { useEffect, useState } from "react";
import { useWeightStore } from "../../data/stores/useWeightConfiguration";
import RadioOptions from "../../components/atoms/RadioOptions";

interface WeightComponent {
  componentName: string;
  mass: number;
  cords: { x: number; y: number; z: number };
}
interface Props {
  isVisible:boolean
  onClose: React.Dispatch<React.SetStateAction<boolean>>
}

const radioButtonsText = [
  "Empty Configuration",
  "Clone from the configuration",
  "Load from computer",
];

const AddConfiguration = ({isVisible , onClose}:Props) => {

  const [name, setName] = useState("");
  const [weightComponents, setWeightComponents] = useState<
    WeightComponent[] | never[]
  >([]);
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

    //setting  back default options
    setWeightComponents([]);
    setName("");
    onClose(false)
  };

  const handleSelect = (name: string) => {
    let i = weightConfigurations.findIndex((config) => config.name === name);
    if (i > -1) {
      let newComponent = weightConfigurations[i].components
      setWeightComponents(newComponent)
    }
  };
  useEffect(()=>{console.log(isVisible)},[isVisible])
  if (!isVisible){
    return null;
  }

  return (
    <div className="flex flex-col">
      <div className="fixed inset-0 bg-black bg-opacity-25
       backdrop-blur-sm flex justify-center items-center">
      <div className="form">
        <div className="bg-white w-80 rounded-2xl flex  flex-col justify-center items-center">
          <label className="label m-2">
            <span>Crete new configuration:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-60 m-2"
            placeholder="Input configuration name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>

          <RadioOptions
            options={radioButtonsText}
            checkedButton={checkedButton}
            setCheckedButton={setCheckedButton}
          />
          {/* {checkedButton === "Empty Configuration" && (setWeightComponents([]))} */}

          {checkedButton === "Clone from the configuration" && (
            <select
              className="select select-bordered w-60 max-w-xs m-2"
              onChange={(e) => handleSelect(e.target.value)}
            >
              {weightConfigurations &&
                weightConfigurations.map((config) => (
                  <option key = {config.name} value={config.name}>{config.name}</option>
                ))}
            </select>
          )}

          {checkedButton === "Load from computer" &&
            "The option is not aviable yet"}

          <div className="modal-action m-2">
            <button
              className="btn"
              onClick={() => handleSubmit()}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AddConfiguration;
