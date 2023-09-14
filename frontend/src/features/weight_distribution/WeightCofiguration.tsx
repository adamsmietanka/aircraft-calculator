import WeightComponet from "./WeightComponet";
import { useWeightStore } from "./stores/useWeightConfiguration";
import WeightComponent from "./interfaces/weightComponent";

const WeightCofiguration = ({ setToggleModal }: any) => {
  const setUseType = useWeightStore((state) => state.setUseType);
  const setEditedComponet = useWeightStore((state) => state.setEditedComponent);

  const activeWeightConfiguration = useWeightStore(
    (state) => state.activeWeightConfiguration
  );
  const setAcitveWeightConfiguration = useWeightStore(
    (state) => state.setActiveWeightConfiguration
  );

  const handleEdit = (component: WeightComponent) => {
    setUseType("edit");
    setEditedComponet(component);
    setToggleModal(true);
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
    <div className="flex flex-col overflow-x-auto">
      <table className="table table-xs ">
        <thead>
          <tr>
            <th>Name</th>
            <th>{"Mass [kg]"}</th>
            <th>X</th>
            <th>Y</th>
            <th>Z</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {activeWeightConfiguration?.components &&
            activeWeightConfiguration?.components.map(
              (component: WeightComponent) => (
                <WeightComponet
                  key={component?.componentName}
                  name={component?.componentName}
                  mass={component?.mass}
                  x={component?.x}
                  y={component?.y}
                  z={component?.z}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                />
              )
            )}
        </tbody>
      </table>
    </div>
  );
};

export default WeightCofiguration;
