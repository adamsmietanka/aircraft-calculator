import React from "react";
import StabillityChartsCenterOfStabillityCharts from "../molecules/StabillityChartsCenterOfStabillityCharts";
import StabillityChartsCriteriaChart from "../molecules/StabillityChartsCriteriaChart";
import StabillityChartsReserveOfStabillityCharts from "../molecules/StabillityChartsReserveOfStabillityCharts";



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
