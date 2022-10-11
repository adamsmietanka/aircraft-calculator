import WeightComponet from "../atoms/WeightComponet";
import { useState } from "react";

function addComponent() {}

const WeightCofiguration = () => {
  const weightComponents = [{ name: "Fuselage", mass: 1000, x: 0, y: 0, z: 0 }];
  const [modalOpened,setModalOpened] = useState(false)
  return (
    <div className="collapse collapse-arrow">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium">
        Main Configuration
      </div>
      <div className="collapse-content">
        {weightComponents.length > 0
          ? weightComponents.map((weightComponent) => (
              <WeightComponet
                name={weightComponent.name}
                mass={weightComponent.mass}
                x={weightComponent.x}
                y={weightComponent.y}
                z={weightComponent.z}
                // edit = {setModalOpened}
              />
            ))
          : "No components in this configuration"}
        <label className="btn modal-button" htmlFor="my-modal-5">
          Add component
        </label>
      </div>
    </div>
  );
};

export default WeightCofiguration;
