import React, { useEffect, useState } from "react";
import InputNumber from "../../components/atoms/InputNumber";
import { useWeightStore } from "../../data/stores/useWeightConfiguration";

interface WeightComponent {
  componentName: string;
  mass: number;
  cords: { x: number; y: number; z: number };
}

interface props {
  useType: string;
  component?: WeightComponent;
  isVisible: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddComponent = ({ useType, component, isVisible, onClose }: props) => {
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
  const [componentName, setName] = useState("Fuselage");
  const [mass, setMass] = useState(900);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);

  useEffect(() => {
    if (component && useType === "edit") {
      setName(component?.componentName);
      setMass(component.mass)
      setX(component.cords.x)
      setY(component.cords.y)
      setZ(component.cords.z)
    }
  },[component]);

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
    <div>
      <div
        className="fixed inset-0 bg-black bg-opacity-25
       backdrop-blur-sm flex justify-center items-center"
      >
        <div className="bg-white w-80 rounded-2xl flex  flex-col justify-center items-center">
          <label className="label">
            <span className="label-text">
              Component of the {activeWeightConfiguration.name} configuration.
            </span>
          </label>
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

          <InputNumber label="mass" unit="kg" value={mass} setter={setMass} />
          <InputNumber label="x" unit="m" value={x} setter={setX} />
          <InputNumber label="y" unit="m" value={y} setter={setY} />
          <InputNumber label="z" unit="m" value={z} setter={setZ} />

          <div className="modal-action">
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
  );
};

export default AddComponent;
