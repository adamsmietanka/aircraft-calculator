import { useEffect, useMemo, useState } from "react";
import { useInitialStore } from "./useInitial";
import Plot from 'react-plotly.js';

interface PerformanceChartProps {
  trace: {
    xes: number[];
    xes2: number[];
    xes3: number[];
    yes: number[];
    yes2: number[];
    yes3: number[];
    zes: number[];
    zes2: number[];
    zes3: number[];
  };
}

const PerformanceInitialEnduranceChart = ({trace}: PerformanceChartProps) => {

const xes = trace.xes;
const xes2 = trace.xes2;
const xes3 = trace.xes3;
const yes = trace.yes;
const yes2 = trace.yes2;
const yes3 = trace.yes3;
const zes = trace.zes;
const zes2 = trace.zes2;
const zes3 = trace.zes3;  


  useEffect(() => {
    console.log("log")
  }, []);

  let layout = {
    title: 'Endurance vs Velocity',
    font: { size: 18 },
    height: window.innerWidth > 960 ? 600 : window.innerHeight * 0.5,
    width: window.innerWidth > 1800 ? 600 : window.innerWidth * 0.5,

    margin: {
      l: 65,
      r: 10,
      b: 100,
      t: 100,
      pad: 4,
    },
    yaxis: {
      range: [Math.min(...yes)*0.9, Math.max(...yes) * 1.1],
      title: {
        text: 'Endurance [100*H]',
        font: { size: 16 },
      },
    },
    xaxis: {
      range: [Math.min(...xes)*0.9, Math.max(...xes)*1.1],
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
              x: xes,
              y: yes,
              type: 'scatter',
              mode: 'lines',
              line: {dash: 'dash'},
              marker: {color: 'red'},
              name: 'Breguet - 1st set',
            },
            {
              x: xes2,
              y: yes2,
              type: 'scatter',
              mode: 'lines',
              marker: {color: 'blue'},
              name: 'Breguet - 2nd set',
            },
            {
              x: xes3,
              y: yes3,
              type: 'scatter',
              mode: 'lines',
              line: {dash: 'dashdot'},
              marker: {color: 'green'},
              name: 'Breguet - 3rd set',
            }
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

export default PerformanceInitialEnduranceChart;


