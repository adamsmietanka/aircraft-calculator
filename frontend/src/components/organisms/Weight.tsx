import React, { useState } from "react";
import WeightCofiguration from "../molecules/WeightCofiguration";
import { useWeightStore } from "../../utils/useWeightConfiguration";
import { ReactComponent as Edit } from "../../assets/edit.svg";
import { Link } from "react-router-dom";
import WeightDistributionCharts from "../molecules/WeightDistributionCharts";


const Weight = () => {
  const configurations = useWeightStore((state) => state.weightConfigurations);
  const setConfigurations = useWeightStore((state) => state.setWeightConfigurations);
  
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
          <WeightDistributionCharts/>
        </div>
      </div>

      <div className="drawer-side">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
        <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
          {configurations.map((configuration) => (
            <li className="flex flex-row m-2">
                <span>{configuration.name} </span>
                <button className="btn  background-color- bg-yellow-50 w-6"> {React.cloneElement(<Edit className="w-6"/>, {className:"w-6"} )},</button>
                <button className="btn btn-secondary w-6">X</button>
            </li>
          ))}
          <button className="btn btn-primary">Add new configuration</button>
        </ul>
      </div>
    </div>
  );
};

export default Weight;
