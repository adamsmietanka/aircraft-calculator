import { useEffect} from "react";
import { useInitialStore } from "./stores/useInitial";
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

const PerformanceInitialRangeChart = ({trace}: PerformanceChartProps) => {

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
      title: 'Range vs Velocity',
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
        range: [Math.min(...zes)*0.9, Math.max(...zes) * 1.1],
        title: {
          text: 'Range [km]',
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
              y: zes,
              type: 'scatter',
              mode: 'lines',
              line: {dash: 'dash'},
              marker: {color: 'red'},
              name: 'Const. H-V',
            },
            {
              x: xes2,
              y: zes2,
              type: 'scatter',
              mode: 'lines',
              marker: {color: 'blue'},
              name: 'Const AoA-H',
            },
            {
              x: xes3,
              y: zes3,
              type: 'scatter',
              mode: 'lines',
              line: {dash: 'dashdot'},
              marker: {color: 'green'},
              name: 'Const. AoA-V',
            }
          ]}
          layout={layout}
          config={{
            scrollZoom: false,
            responsive: true,
            modeBarButtons: [['toImage']],
            toImageButtonOptions: {
              format: 'png',
              filename: 'initial_range',
            },
          }}
        />
    );
  };

export default PerformanceInitialRangeChart