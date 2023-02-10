import React from "react";
import StabillityChartsCenterOfStabillityCharts from "./reserveCharts/StabillityChartsCenterOfStabillityCharts";
import StabillityChartsCriteriaChart from "./reserveCharts/StabillityChartsCriteriaChart";
import StabillityChartsReserveOfStabillityCharts from "./reserveCharts/StabillityChartsReserveOfStabillityCharts";



const StabillityCharts = () => {
  return (
    <div>
      <StabillityChartsCenterOfStabillityCharts />
      <StabillityChartsReserveOfStabillityCharts />
      <StabillityChartsCriteriaChart/>
    </div>
  );
};

export default StabillityCharts;
