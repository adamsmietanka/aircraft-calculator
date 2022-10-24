import WeightComponet from "../atoms/WeightComponet";
import { useWeightStore } from "../../utils/useWeightConfiguration";
import AddComponent from "./AddComponent";

interface WeightComponent {
  componentName: string;
  mass: number;
  cords: { x: number; y: number; z: number };
}


const WeightCofiguration = () => {
  const activeConfiguration = useWeightStore((state) => state.activeWeightConfiguration);
 
  return (
    <div className="flex flex-col">
      <span className=" m-2 flex justfy-center text-lg">
        {activeConfiguration?.name}
      </span>

      <div className="flex flex-col overflow-auto">
        {activeConfiguration?.components &&
          activeConfiguration?.components.map((component:WeightComponent) => (
            <WeightComponet
              key={component?.componentName}
              name={component?.componentName}
              mass={component?.mass}
              cords={component?.cords}
            />
          ))}

        {activeConfiguration && (
          <AddComponent name={activeConfiguration.name}  components={activeConfiguration.components} />
        )}
      </div>
    </div>
  );
};

export default WeightCofiguration;
