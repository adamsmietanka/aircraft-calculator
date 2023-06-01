import React from "react";
import StabillityChartsCenterOfStabillityCharts from "./reserveCharts/StabillityChartsCenterOfStabillityCharts";
import StabillityChartsCriteriaChart from "./reserveCharts/StabillityChartsCriteriaChart";
import StabillityChartsReserveOfStabillityCharts from "./reserveCharts/StabillityChartsReserveOfStabillityCharts";

const StabillityCharts = () => {
  return (
    <div className="flex flex-col">
      <h1 className="text-xl m-2">
        {" "}
        Centers of Stabillity and Manouverablillity{" "}
      </h1>
      <StabillityChartsCenterOfStabillityCharts />
      <h1 className="text-xl m-2">
        {" "}
        Reserve of Stabillity and Manouverablillity{" "}
      </h1>
      <StabillityChartsReserveOfStabillityCharts />
      <h1 className="text-xl m-2">
        {" "}
        Criterias of Stabillity and Manouverablillity{" "}
      </h1>
      <StabillityChartsCriteriaChart />
    </div>
  );
};

export default StabillityCharts;
