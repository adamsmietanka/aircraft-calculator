import { useEffect} from "react";
import { useInitialStore } from "./useInitial";
import Plot from 'react-plotly.js';

interface PerformanceExtendedChartProps {
  trace: {
    xes: number[];
    yes: number[];
    zes: number[];
  };
}

const PerformanceExtendedChart = ({trace}: PerformanceExtendedChartProps) => {

  const xes = trace.xes;

  const yes = trace.yes;

  const zes = trace.zes;


    useEffect(() => {
      console.log("log")
    }, []);
  
    let layout = {
      title: 'Range and Endurance vs Velocity',
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
        range: [Math.min(...yes)*0.9, Math.max(...zes) * 1.1],
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
              name: 'Range',
            },
            {
              x: xes,
              y: yes,
              type: 'scatter',
              mode: 'lines',
              line: {dash: 'dashdot'},
              marker: {color: 'blue'},
              name: 'Endurance',
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

export default PerformanceExtendedChart