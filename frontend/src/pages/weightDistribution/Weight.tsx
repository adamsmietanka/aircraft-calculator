import React, { useState, useEffect } from "react";
import WeightCofiguration from "./WeightCofiguration";
import { useWeightStore } from "../../data/stores/useWeightConfiguration";
import WeightDistributionCharts from "./WeightDistributionCharts";
import AddConfiguration from "./AddConfiguration";

import { CoG } from "../../utils/massCalculations";
import AddComponent from "./AddComponent";
import WeightComponent from "./interfaces/weightComponent";
import WeightConfiguration from "./interfaces/weightConfiguration";

const Weight = () => {
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const [toggleModal_2, setToggleModal_2] = useState<boolean>(false);
  const editedCompnent = useWeightStore((state) => state.editedComponent);
  const useType = useWeightStore((state) => state.useType);
  const setUseType = useWeightStore((state) => state.setUseType);
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
  const setCog = useWeightStore((state) => state.setCog);
  const handleDelete = (name: string) => {
    let confugurations = weightConfigurations.filter(
      (weightConfiguration) => weightConfiguration.name !== name
    );
    setWeightConfigurations(confugurations);
  };

  useEffect(() => {
    console.log("Rerendering menu");
  }, [activeWeightConfiguration.name]);

  useEffect(() => {
    setCog(CoG(activeWeightConfiguration.components));
  }, [activeWeightConfiguration.components]);

  useEffect(() => {
    let i = weightConfigurations.findIndex(
      (config) => config.name === activeWeightConfiguration.name
    );
    let configs = weightConfigurations;
    configs[i] = activeWeightConfiguration;
    setWeightConfigurations(configs);
    setUseType("add");
  }, [
    activeWeightConfiguration,
    setUseType,
    setWeightConfigurations,
    weightConfigurations,
  ]);

  return (
    <div className="drawer drawer-end">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className=" flex flex-row ">
          <div className="flex flex-col w-64 mr-8 space-y-2">
            <label
              htmlFor="my-drawer-4"
              className="drawer-button btn btn-primary"
            >
              Choose configuration
            </label>
            <WeightCofiguration setToggleModal={setToggleModal_2} />
            {activeWeightConfiguration && (
              <button
                className="btn  justify-center"
                onClick={() => {
                  setToggleModal_2(true);
                }}
              >
                Add component
              </button>
            )}
          </div>
          <div className="flex flex-col">
            <WeightDistributionCharts />
          </div>
          {activeWeightConfiguration && useType === "add" && (
            <AddComponent
              useType="add"
              isVisible={toggleModal_2}
              onClose={setToggleModal_2}
            />
          )}
          {activeWeightConfiguration && useType === "edit" && (
            <AddComponent
              useType="edit"
              component={editedCompnent}
              isVisible={toggleModal_2}
              onClose={setToggleModal_2}
            />
          )}
        </div>
      </div>

      <div className="drawer-side">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
        <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
          {weightConfigurations.map(
            (configuration) => (
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
