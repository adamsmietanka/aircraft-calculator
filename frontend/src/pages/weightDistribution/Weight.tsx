import React, { useState, useEffect } from "react";
import WeightCofiguration from "./WeightCofiguration";
import { useWeightStore } from "../../data/stores/useWeightConfiguration";
import WeightDistributionCharts from "./WeightDistributionCharts";
import AddConfiguration from "./AddConfiguration";
import { ReactComponent as Edit } from "../../assets/edit.svg";

import { CoG } from "../../utils/massCalculations";
import AddComponent from "./AddComponent";

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
  const Cog = useWeightStore((state) => state.cog);
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
        {/* Header */}
        <div className="flex flex-col">
          {/* ROW 1 */}
          <div className="flex flex-row justify-between m">
            <h1 className="text-3xl font p-2">Mass Distrubiution tool</h1>
            <label
              htmlFor="my-drawer-4"
              className="drawer-button btn btn-primary w-64 p-2 mr-4"
            >
              Choose configuration
            </label>
          </div>
          {/* ROW 2 */}
          <div className="flex flex-row m-2 ">
            <h2 className="text-xl w-64">{activeWeightConfiguration.name}</h2>
            <div className="flex space-x-10">
              <div className="flex">
                <h2 className="text-l font-semibold">{`CoG`}</h2>
                <h2 className="text-l font-light">{`: (${Cog.x.toPrecision(
                  2
                )} ,${Cog.y.toPrecision(2)}, ${Cog.z.toPrecision(2)})`}</h2>
              </div>
              <div className="flex">
                <h2 className="text-l font-semibold">{`MAC lenght`}</h2>
                <h2 className="text-l font-light">{`: ${activeWeightConfiguration.MAC.toPrecision(
                  2
                )} m`}</h2>
              </div>
              <div className="flex">
                <h2 className="text-l font-semibold">{`Distance between MAC begining and  aircraft nose on x axis`}</h2>
                <h2 className="text-l font-light">{`: ${activeWeightConfiguration.MACPosition.toPrecision(
                  2
                )} m`}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className=" flex flex-row ">
          {/* Left Row */}
          <div className="flex flex-col w-64 mr-8 space-y-2">
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
            <WeightCofiguration setToggleModal={setToggleModal_2} />
          </div>
          {/*right row */}
          <div className="flex flex-col">
            <WeightDistributionCharts />
          </div>
        </div>
      </div>

      <div className="drawer-side">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
        <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
          {weightConfigurations.map((configuration) => (
            <li
              className="flex flex-row justify-between m-2"
              key={configuration.name}
            >
              <button
                onClick={() => {
                  setAcitveWeightConfiguration(configuration);
                }}
              >
                {configuration.name}{" "}
              </button>

              <button
                className="btn bg-red-600 w-6"
                onClick={() => {
                  handleDelete(configuration.name);
                }}
              >
                X
              </button>
              <button className="btn bg-yellow-600 w-6">
                <Edit />
              </button>
            </li>
          ))}
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
  );
};

export default Weight;
