import React, { useState, useEffect } from "react";
import WeightCofiguration from "../molecules/WeightCofiguration";
import { useWeightStore } from "../../utils/useWeightConfiguration";
import WeightDistributionCharts from "../molecules/WeightDistributionCharts";
import AddConfiguration from "../molecules/AddConfiguration";

interface WeightComponent {
  componentName: string;
  mass: number;
  cords: { x: number; y: number; z: number };
}

const Weight = () => {
  const [toggleModal, setToggleModal] = useState<boolean>(false);
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

  const handleDelete = (name: string) => {
    let confugurations = weightConfigurations.filter(
      (weightConfiguration) => weightConfiguration.name !== name
    );
    setWeightConfigurations(confugurations);
  };


  useEffect(() => {
    console.log("Rerendering menu");
  }, [activeWeightConfiguration.name]);

  return (
    <div className="drawer drawer-end">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="flex ">
          <div className="flex flex-col w-64 mr-8 space-y-2">
            <label
              htmlFor="my-drawer-4"
              className="drawer-button btn btn-primary"
            >
              Choose configuration
            </label>
            <WeightCofiguration />
          </div>
          <WeightDistributionCharts />
        </div>
      </div>

      <div className="drawer-side">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
        <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
          {weightConfigurations.map(
            (configuration: {
              name: string;
              components: Array<WeightComponent>;
            }) => (
              <li className="flex flex-row m-2" key={configuration.name}>
                <button
                  onClick={() => {
                    setAcitveWeightConfiguration(configuration);
                  }}
                >
                  {configuration.name}{" "}
                </button>

                <button
                  className="btn btn-secondary w-6"
                  onClick={() => {
                    handleDelete(configuration.name);
                  }}
                >
                  X
                </button>
              </li>
            )
          )}
          <label
            className="btn modal-button justify-center"
            onClick={() => {
              setToggleModal(true);
            }}
          >
            Add Configuration
          </label>
        </ul>
      </div>
      <AddConfiguration isVisible={toggleModal} onClose={setToggleModal} />
    </div>
  );
};

export default Weight;
