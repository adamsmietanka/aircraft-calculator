import Plotly from "plotly.js-dist-min";
import { useWeightStore } from "../../utils/useWeightConfiguration";
import { useEffect } from "react";

const layouts = (axis: string) => {
  let layout = {
    plotTittle: "Position on XY",
    xTitle: "x [m]",
    yTitle: "y [m]",
  };
  switch (axis) {
    case "plot_xy":
      layout = {
        plotTittle: "Position on XY",
        xTitle: "x [m]",
        yTitle: "y [m]",
      };
      break;
    case "plot_yz":
      layout = {
        plotTittle: "Position on YZ",
        xTitle: "y [m]",
        yTitle: "z [m]",
      };
      break;
    case "plot_xz":
      layout = {
        plotTittle: "Position on XZ",
        xTitle: "x [m]",
        yTitle: "z [m]",
      };
      break;
  }
  return {
    title: {
      text: layout.plotTittle,
      font: {
        size: 24,
      },
    },
    xaxis: {
      title: {
        text: layout.xTitle,
        font: {
          size: 14,
        },
      },
    },
    yaxis: {
      title: {
        text: layout.yTitle,
        font: {
          size: 14,
        },
      },
    },
  };
};

const WeightDistributionCharts = () => {
  useEffect(() => {
    let XY =
      {  
          x: [0,2,6,5], 
          y: [0,5,7,8] ,
          mode:'markers'}
        ; 
    // console.log(traces);
    Plotly.newPlot("plot_xy", [XY], layouts("plot_xy"));
    Plotly.newPlot("plot_yz", [XY], layouts("plot_yz"));
    Plotly.newPlot("plot_xz", [XY], layouts("plot_xz"));
  });
  const activeWeightConfiguration = useWeightStore(
    (state) => state.activeWeightConfiguration
  );
  return (
    <div className=" w-full text-bold text-black text-3xl flex flex-col justify-center items-center">
      <div id="plot_xy"></div>
      <div id="plot_yz"></div>
      <div id="plot_xz"></div>
    </div>
  );
};

export default WeightDistributionCharts;
