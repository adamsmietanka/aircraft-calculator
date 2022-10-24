import React, { useState } from "react";
import InputNumber from "../atoms/InputNumber";
import { useWeightStore } from "../../utils/useWeightConfiguration";

interface WeightComponent {
  componentName: string;
  mass: number;
  cords: { x: number; y: number; z: number };
}

interface configuration {
  name: string;
  components: Array<WeightComponent>;
}

const AddComponent = ({ name, components }: configuration) => {
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

  const handleChange = (component: WeightComponent) => {
    let foundComponent = activeWeightConfiguration.components.find(
      (comp) => comp.componentName === component.componentName
    );
    if (foundComponent === undefined) {
      console.log("nie ma tego");
      let components: Array<WeightComponent> =
        activeWeightConfiguration.components;
      components.push(component);
      setAcitveWeightConfiguration({
        name: activeWeightConfiguration.name,
        components: components,
      });
    }
  };
  return (
    <div>
      <label className="btn modal-button justify-center" htmlFor="my-modal">
        Add component
      </label>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <label className="label">
            <span className="label-text">
              Component of the {name} configuration.
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

            <label htmlFor="my-modal" className="btn">
              Submit
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddComponent;
