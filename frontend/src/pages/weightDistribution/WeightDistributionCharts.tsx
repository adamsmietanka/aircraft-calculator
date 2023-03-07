import Plotly from "plotly.js-dist-min";
import { useWeightStore } from "../../data/stores/useWeightConfiguration";
import { useEffect } from "react";
import {
  CoG,
  getNamesArray,
  getXarray,
  getYarray,
  getZarray,
} from "../../utils/massCalculations";
import WeightComponent from "./interfaces/weightComponent";

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

const getTrace = (configuration: Array<WeightComponent>, axis: string) => {
  let emptyNmberArray:number[] = []
  let trace = {
    x: emptyNmberArray,
    y: emptyNmberArray,
    mode: "markers",
    name: "Components",
    text: getNamesArray(configuration),
    textfont: {
      family: "Times New Roman",
    },
    textposition: "bottom center",
    marker: { size: 12 },
  };
  var CoGtrace = {
    x: emptyNmberArray,
    y: emptyNmberArray,
    mode: "markers+text",
    type: "scatter",
    name: "Center of gravity",
    text: ["CoG"],
    textfont: {
      family: "Times New Roman",
    },
    textposition: "bottom center",
    marker: { size: 12 },
  };
  if (configuration.length === 0){
    return  [trace, CoGtrace]
  }
  let CoGvalue = CoG(configuration);
  switch (axis) {
    case "plot_xy":
      trace = {
        x: getXarray(configuration),
        y: getYarray(configuration),
        mode: "markers",
        name: "Components",
        text: getNamesArray(configuration),
        textfont: {
          family: "Times New Roman",
        },
        textposition: "bottom center",
        marker: { size: 12 },
      };
      CoGtrace = {
        x: [CoGvalue.x],
        y: [CoGvalue.y],
        mode: "markers+text",
        type: "scatter",
        name: "Center of gravity",
        text: ["CoG"],
        textfont: {
          family: "Times New Roman",
        },
        textposition: "bottom center",
        marker: { size: 12 },
      };
      break;
    case "plot_yz":
      trace = {
        x: getYarray(configuration),
        y: getZarray(configuration),
        mode: "markers",
        name: "Components",
        text: getNamesArray(configuration),
        textfont: {
          family: "Times New Roman",
        },
        textposition: "bottom center",
        marker: { size: 12 },
      };
      CoGtrace = {
        x: [CoGvalue.y],
        y: [CoGvalue.z],
        mode: "markers+text",
        type: "scatter",
        name: "Center of gravity",
        text: ["CoG"],
        textfont: {
          family: "Times New Roman",
        },
        textposition: "bottom center",
        marker: { size: 12 },
      };
      break;
    case "plot_xz":
      trace = {
        x: getXarray(configuration),
        y: getZarray(configuration),
        mode: "markers",
        name: "Components",
        text: getNamesArray(configuration),
        textfont: {
          family: "Times New Roman",
        },
        textposition: "bottom center",
        marker: { size: 12 },
      };
      CoGtrace = {
        x: [CoGvalue.x],
        y: [CoGvalue.z],
        mode: "markers+text",
        type: "scatter",
        name: "Center of gravity",
        text: ["CoG"],
        textfont: {
          family: "Times New Roman",
        },
        textposition: "bottom center",
        marker: { size: 12 },
      };
      break;
  }
  return [trace, CoGtrace];
};

const WeightDistributionCharts = () => {
  const activeWeightConfiguration = useWeightStore(
    (state) => state.activeWeightConfiguration
  );
  const cog = useWeightStore((state) => state.cog);
  useEffect(() => {
    let traces = {
      plot_xy: getTrace(activeWeightConfiguration.components, "plot_xy"),
      plot_yz: getTrace(activeWeightConfiguration.components, "plot_yz"),
      plot_xz: getTrace(activeWeightConfiguration.components, "plot_xz"),
    };
    Plotly.newPlot("plot_xy", getTrace(activeWeightConfiguration.components,"plot_xy"), layouts("plot_xy"));
    Plotly.newPlot("plot_yz", getTrace(activeWeightConfiguration.components,"plot_yz"), layouts("plot_yz"));
    Plotly.newPlot("plot_xz", getTrace(activeWeightConfiguration.components,"plot_xz"), layouts("plot_xz"));
  });

  return (
    <div className=" w-full text-bold text-black text-3xl flex flex-col justify-center items-center">
      <div id="plot_xy"></div>
      <div id="plot_yz"></div>
      <div id="plot_xz"></div>
    </div>
  );
};

export default WeightDistributionCharts;
