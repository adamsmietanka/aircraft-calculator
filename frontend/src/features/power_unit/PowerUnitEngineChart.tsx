import { useMemo } from "react";
import { useEngineStore } from "./hooks/useEngine";
import { usePower } from "./hooks/usePower";
import Plot from "react-plotly.js";

const PowerUnitEngineChart = () => {
  const heights = useEngineStore((state) => state.heights);
  const [calculatePower] = usePower();
  const powers = useMemo(
    () => heights.map(calculatePower),
    [calculatePower, heights]
  );

  const layout = useMemo(
    () => ({
      title: "Engine performance",
      font: { size: 18 },
      height: window.innerWidth > 960 ? 600 : window.innerHeight * 0.5,
      width: window.innerWidth > 960 ? 600 : window.innerWidth * 0.9,
      margin: {
        l: 65,
        r: 10,
        b: 100,
        t: 100,
        pad: 4,
      },
      yaxis: {
        range: [0, Math.max(...powers) * 1.1],
        title: {
          text: "Engine Power [kW]",
          font: { size: 16 },
        },
      },
      xaxis: {
        // range: [0, this.engine.maxAltitude],
        title: {
          text: "Altitude [km]",
          font: { size: 16 },
        },
      },
      // dragmode: false,
    }),
    [powers]
  );

  return (
    <Plot
      data={[
        {
          x: heights,
          y: powers,
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
          filename: "engine_power",
        },
      }}
    />
  );
};

export default PowerUnitEngineChart;
