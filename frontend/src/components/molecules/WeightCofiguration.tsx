import WeightComponet from "../atoms/WeightComponet";
import { useState } from "react";
import { useWeightStore } from "../../utils/useWeightConfiguration";
import AddComponent from "./AddComponent";

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

function addComponent() {}
function isActive(configuration: config) {
  if (configuration.enabled) {
    return configuration;
  }
}
const WeightCofiguration = () => {
  const configurations = useWeightStore((state) => state.weightConfigurations);
  let activeConfiguration = configurations.find(isActive);
  return (
    <div className="flex flex-col">
      <span className=" m-2 flex justfy-center text-lg">
        {activeConfiguration?.name}
      </span>

      <div className="flex flex-col overflow-auto">
        {activeConfiguration?.components &&
          activeConfiguration?.components.map((component) => (
            <WeightComponet
              key={component?.componentName}
              name={component?.componentName}
              mass={component?.mass}
              cords={component?.cords}
            />
          ))}

        {activeConfiguration && (
          <AddComponent name={activeConfiguration.name}  components={activeConfiguration.components} enabled={activeConfiguration.enabled} />
        )}
      </div>
    </div>
  );
};

export default WeightCofiguration;
