import { usePropellerStore } from "./stores/usePropeller";
import Plot from "react-plotly.js";
import { data } from "./data/prop";

interface Props {
  Cn: number;
  J: number;
}

const PowerUnitPropellerChart = ({ Cn, J }: Props) => {
  const optimized = usePropellerStore((state) => state.optimized);

  const layout = {
    title: "Maximum Efficiency Curves",
    font: { size: 14 },
    height: window.innerWidth > 960 ? 500 : window.innerHeight * 0.7,
    width: window.innerWidth > 960 ? 600 : window.innerWidth * 0.9,
    margin: {
      l: 65,
      r: 0,
      b: 100,
      t: 100,
      pad: 4,
    },
    yaxis: {
      title: {
        text: "Advance Ratio [J]",
        font: { size: 16 },
      },
    },
    xaxis: {
      title: {
        text: "Cn",
        font: { size: 16 },
      },
    },
  };

  return (
    <div className="sticky top-28">
      <Plot
        data={[
          {
            name: "2 blades",
            x: data.cn,
            y: data[2],
            type: "scatter",
            mode: "lines",
          },
          {
            name: "3 blades",
            x: data.cn,
            y: data[3],
            type: "scatter",
            mode: "lines",
          },
          {
            name: "4 blades",
            x: data.cn,
            y: data[4],
            type: "scatter",
            mode: "lines",
          },
          {
            name: "vertical",
            x: [Cn, Cn],
            y: [data[2][0], J],
            type: "scatter",
            mode: "lines",
            line: {
              color: "gray",
              dash: "dot",
              width: 2,
            },
            showlegend: false,
          },
          optimized
            ? {
                name: "horizontal",
                x: [data.cn[0], Cn],
                y: [J, J],
                type: "scatter",
                mode: "lines",
                line: {
                  color: "gray",
                  dash: "dot",
                  width: 2,
                },
                showlegend: false,
              }
            : {},
        ]}
        layout={layout}
        config={{
          scrollZoom: false,
          responsive: true,
          modeBarButtons: [["toImage"]],
          toImageButtonOptions: {
            format: "png",
            filename: "engine_power",
          },
        }}
      />
    </div>
  );
};

export default PowerUnitPropellerChart;
