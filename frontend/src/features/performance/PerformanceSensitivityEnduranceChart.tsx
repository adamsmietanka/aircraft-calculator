import { useEffect} from "react";
import Plot from 'react-plotly.js';

interface PerformanceSensitivityChartProps {
  trace: {
    xes: number[];
    yes: number[];
    yes2: number[];
    yes3: number[];
    zes: number[];
    zes2: number[];
    zes3: number[];
  };
}

const PerformanceSensitivityEnduranceChart = ({trace}: PerformanceSensitivityChartProps) => {

  const xes = trace.xes;
  const yes = trace.yes;
  const yes2 = trace.yes2;
  const yes3 = trace.yes3;


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
        range: [Math.min(...yes,...yes2,...yes3)*0.9, Math.max(...yes,...yes2,...yes3) * 1.1],
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
              name: '100%',
            },
            {
                x: xes,
                y: yes2,
                type: 'scatter',
                mode: 'lines',
                line: {dash: 'solid'},
                marker: {color: 'blue'},
                name: '75%',
            },
            {
                x: xes,
                y: yes3,
                type: 'scatter',
                mode: 'lines',
                line: {dash: 'dashdot'},
                marker: {color: 'green'},
                name: '50%',
            },
            
          ]}
          layout={layout}
          config={{
            scrollZoom: false,
            responsive: true,
            modeBarButtons: [['toImage']],
            toImageButtonOptions: {
              format: 'png',
              filename: 'endurance_sensitivity',
            },
          }}
        />
    );
  };

export default PerformanceSensitivityEnduranceChart