import React, { useEffect, useState } from "react";
import CloseButton from "../../components/atoms/CloseButton";
import InputNumber from "../common/InputNumber";
import { useWeightStore } from "../../data/stores/useWeightConfiguration";
import WeightComponent from "./interfaces/weightComponent";

interface props {
  useType: string;
  component?: WeightComponent;
  isVisible: boolean;
  onClose: (value: boolean) => void;
}

const AddComponent = ({ useType, component, isVisible, onClose }: props) => {
  const activeWeightConfiguration = useWeightStore(
    (state) => state.activeWeightConfiguration
  );
  const setAcitveWeightConfiguration = useWeightStore(
    (state) => state.setActiveWeightConfiguration
  );
  const [componentName, setName] = useState("Fuselage");
  const [mass, setMass] = useState(900);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);

  useEffect(() => {
    if (component && useType === "edit") {
      setName(component?.componentName);
      setMass(component.mass);
      setX(component.cords.x);
      setY(component.cords.y);
      setZ(component.cords.z);
    }
  }, [component]);

  const handleChange = (component: WeightComponent) => {
    let foundComponent = activeWeightConfiguration.components.find(
      (comp) => comp.componentName === component.componentName
    );
    if (useType === "add") {
      if (foundComponent === undefined) {
        let components: Array<WeightComponent> =
          activeWeightConfiguration.components;
        components.push(component);
        setAcitveWeightConfiguration({
          ...activeWeightConfiguration,
          components: components,
        });
      }
    }
    if (useType === "edit") {
      let i = activeWeightConfiguration.components.findIndex(
        (c) => c.componentName === foundComponent?.componentName
      );
      let newComponents = activeWeightConfiguration.components;
      newComponents[i] = component;
      setAcitveWeightConfiguration({
        ...activeWeightConfiguration,
        components: newComponents,
      });
    }
  };

  if (!isVisible) {
    return null;
  }
  return (
    <div className="flex flex-col ">
      <div
        className="fixed inset-0 bg-black bg-opacity-25
       backdrop-blur-sm justify-center items-center"
      >
        <div className="form">
          <div className="bg-white w-80 rounded-2xl flex flex-col justify-self-center">
            <div className="flex flex-row m-2 items-end justify-end">
              <CloseButton onClose={onClose} />
            </div>
            <div className="flex flex-col items-center m-2">
              <h3 className="text-l">
                Component of the {activeWeightConfiguration.name} configuration.
              </h3>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Component Name</span>
                </label>

                <input
                  type="text"
                  className="input input-bordered"
                  value={componentName}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <InputNumber
                label="mass"
                unit="kg"
                value={mass}
                setter={setMass}
              />
              <InputNumber label="x" unit="m" value={x} setter={setX} />
              <InputNumber label="y" unit="m" value={y} setter={setY} />
              <InputNumber label="z" unit="m" value={z} setter={setZ} />
            </div>

            <div className="flex flex-row m-2">
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  handleChange({
                    componentName: componentName,
                    mass: mass,
                    cords: { x: x, y: y, z: z },
                  });
                }}
              >
                Save
              </button>

              <button
                className="btn"
                onClick={() => {
                  onClose(false);
                }}
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

export default AddComponent;
