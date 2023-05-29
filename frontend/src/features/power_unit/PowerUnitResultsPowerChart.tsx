import { useMemo } from "react";
import Plot from "react-plotly.js";
import { useResultsStore } from "./stores/useResults";

const PowerUnitResultsPowerChart = () => {
  const table = useResultsStore((state) => state.table);

  const layout = useMemo(
    () => ({
      title: "Propeller performance",
      font: { size: 18 },
      height: 500,
      width: window.innerWidth > 960 ? 600 : window.innerWidth * 0.9,
      margin: {
        l: 65,
        r: 10,
        b: 100,
        t: 100,
        pad: 4,
      },
      yaxis: {
        // range: [0, Math.max(...powers) * 1.1],
        title: {
          text: "Propeller Power [kW]",
          font: { size: 16 },
        },
      },
      xaxis: {
        // range: [0, this.engine.maxAltitude],
        title: {
          text: "Velocity [m/s]",
          font: { size: 16 },
        },
      },
      // dragmode: false,
    }),
    [table]
  );

  return (
    <div className="sticky top-28">
      <Plot
        data={[
          {
            x: table.map((row) => row.v),
            y: table.map((row) => row.prop_power),
            type: "scatter",
            mode: "lines",
            marker: { color: "red" },
          },
        ]}
        layout={layout}
        config={{
          scrollZoom: false,
          responsive: true,
          modeBarButtons: [["toImage"]],
          toImageButtonOptions: {
            format: "png",
            filename: "prop_power",
          },
        }}
      />
    </div>
  );
};

export default PowerUnitResultsPowerChart;
