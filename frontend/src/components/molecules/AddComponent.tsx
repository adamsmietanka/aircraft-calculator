import React, { useEffect, useState } from "react";
import InputNumber from "../atoms/InputNumber";
import { useWeightStore } from "../../utils/useWeightConfiguration";

interface WegihtComponent {
  componentName: string;
  mass: number;
  cords: { x: number; y: number; z: number };
}
interface config {
  name: string;
  components: Array<WegihtComponent>;
  enabled: boolean;
}
interface configuration {
  name: string;
  components: Array<WegihtComponent>;
  enabled: boolean;
}
const AddComponent = ({name,components,enabled}:configuration ) => {
  const setConfigurations = useWeightStore(
    (state) => state.setWeightConfigurations
  );
  const [componentName, setName] = useState("Fuselage");
  const [mass, setMass] = useState(900);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);

  function onSubmit(component: WegihtComponent) {
    // let component: WegihtComponent = {
    //   componentName: name,
    //   mass: mass,
    //   cords: { x: x, y: y, z: z },
    // };
    let weightComponents = [...components, component];
    console.log(weightComponents);

    // setConfigurations((currentConfigurations:Array<configuration>)=>([...currentConfigurations,{name:name,components:components,enabled:enabled}]))
  }
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
            <label
              htmlFor="my-modal"
              className="btn"
              onClick={()=> onSubmit({
                componentName: name,
                mass: mass,
                cords: { x: x, y: y, z: z }
              })}
            >
              Submit
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddComponent;
