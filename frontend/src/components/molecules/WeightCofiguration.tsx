import WeightComponet from "../atoms/WeightComponet";
import { useWeightStore } from "../../utils/useWeightConfiguration";

interface WeightComponent {
  componentName: string;
  mass: number;
  cords: { x: number; y: number; z: number };
}

const WeightCofiguration = ({setToggleModal}:any) => {
  const setUseType = useWeightStore((state) => state.setUseType);
  const setEditedComponet = useWeightStore(
    (state) => state.setEditedComponent
  );

  const activeWeightConfiguration = useWeightStore(
    (state) => state.activeWeightConfiguration
  );
  const setAcitveWeightConfiguration = useWeightStore(
    (state) => state.setActiveWeightConfiguration
  );

  const handleEdit = (component: WeightComponent) => {
    setUseType("edit")
    setEditedComponet(component)
    setToggleModal(true)
  };

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
                handleEdit={handleEdit}
              />
            )
          )}
      </div>
    </div>
  );
};

export default WeightCofiguration;
