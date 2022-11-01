import WeightComponet from "../atoms/WeightComponet";
import { useWeightStore } from "../../utils/useWeightConfiguration";
import AddComponent from "./AddComponent";
import { useEffect, useState } from "react";

interface WeightComponent {
  componentName: string;
  mass: number;
  cords: { x: number; y: number; z: number };
}

const WeightCofiguration = () => {
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const [useType, setUseType] = useState<string>("add");
  const [editedCompnent,setEditedComponet]=useState<any>({}) 
  const activeWeightConfiguration = useWeightStore(
    (state) => state.activeWeightConfiguration
  );
  const setAcitveWeightConfiguration = useWeightStore(
    (state) => state.setActiveWeightConfiguration
  );

  const weightConfigurations = useWeightStore(
    (state) => state.weightConfigurations
  );

  const setWeightConfigurations = useWeightStore(
    (state) => state.setWeightConfigurations
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
  
  useEffect(() => {
    let i = weightConfigurations.findIndex(
      (config) => config.name === activeWeightConfiguration.name
    );
    let configs = weightConfigurations;
    configs[i] = activeWeightConfiguration;
    setWeightConfigurations(configs);
    setUseType("add")
  }, [activeWeightConfiguration]);

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

        {activeWeightConfiguration && (
          <button className="btn  justify-center" onClick={()=>{setToggleModal(true)}}>Add component</button>
        )}
        {activeWeightConfiguration && useType==="add" && (
          <AddComponent
            useType="add"
            isVisible={toggleModal}
            onClose={setToggleModal}
          />
        )}
        {activeWeightConfiguration && useType==="edit" && (
          <AddComponent
            useType="edit"
            component={editedCompnent}
            isVisible={toggleModal}
            onClose={setToggleModal}
          />
        )}
      </div>
    </div>
  );
};

export default WeightCofiguration;
