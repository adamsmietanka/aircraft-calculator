import { useEffect, useMemo, useState } from "react";
import { useInitialStore } from "./useInitial";
import Plot from 'react-plotly.js';

const PerformanceInitialRangeChart = () => {
    const heights = [0, 100]
    const powers = [0, 100]
  
    useEffect(() => {
      console.log("log")
    });
  
    let layout = {
      title: 'Range vs Velocity',
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
        range: [0, 100],
        title: {
          text: 'Range [km]',
          font: { size: 16 },
        },
      },
      xaxis: {
        range: [0, 100],
        title: {
          text: 'Velocity [km/h]',
          font: { size: 16 },
        },
      },
    }
    return (
      <Plot
          data={[
            {
              x: heights,
              y: powers,
              type: 'scatter',
              mode: 'lines',
              marker: {color: 'red'},
              name: 'Trace',
            },
          ]}
          layout={layout}
          config={{
            scrollZoom: false,
            responsive: true,
            modeBarButtons: [['toImage']],
            toImageButtonOptions: {
              format: 'png',
              filename: 'engine_power',
            },
          }}
        />
    );
  };

export default PerformanceInitialRangeChart