import WeightComponet from "../atoms/WeightComponet";
import { useWeightStore } from "../../utils/useWeightConfiguration";
import AddComponent from "./AddComponent";

interface configuration {
  name: string;
  components: Array<WeightComponent>;
}

interface WeightComponent {
  componentName: string;
  mass: number;
  cords: { x: number; y: number; z: number };
}

const WeightCofiguration = () => {
  const activeWeightConfiguration = useWeightStore(
    (state) => state.activeWeightConfiguration
  );
  const setAcitveWeightConfiguration = useWeightStore(
    (state) => state.setActiveWeightConfiguration
  );

  const handleDelete = (component: WeightComponent) => {
    setAcitveWeightConfiguration({
      ...activeWeightConfiguration,
      components: activeWeightConfiguration.components.filter(
        (comp) => comp.componentName !== component.componentName
      ),
    });
  };

  return (
    <div className="flex flex-col overflow-auto">
      <span className=" m-2 flex justfy-center text-lg">
        {activeWeightConfiguration?.name}
      </span>

      <div className="flex flex-col ">
        {activeWeightConfiguration?.components &&
          activeWeightConfiguration?.components.map(
            (component: WeightComponent) => (
              <WeightComponet
                key={component?.componentName}
                name={component?.componentName}
                mass={component?.mass}
                cords={component?.cords}
                handleDelete={handleDelete}
              />
            )
          )}

        {activeWeightConfiguration && (
          <AddComponent
            name={activeWeightConfiguration.name}
            components={activeWeightConfiguration.components}
          />
        )}
      </div>
    </div>
  );
};

export default WeightCofiguration;
