import { useEffect, useMemo, useState } from "react";
import { useInitialStore } from "./stores/useInitial";
import { useBreguet } from "./hooks/useBreguet";
import Plot from 'react-plotly.js';

const PerformanceInitialEnduranceChart = () => {
  const velocities = useInitialStore((state) => state.velocities);
  const [calculateEndurance, calculateRange] = useBreguet();
  
  const endurances = useMemo(
    () => velocities.map(calculateEndurance),
    [calculateEndurance, velocities]
  );

  const ranges = useMemo(
    () => velocities.map(calculateRange),
    [calculateRange, velocities]
  );

  const visibilityArray = ranges.concat(endurances)

  const layout = useMemo(
    () => ({
      title: 'Endurance and Range vs Velocity',
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
        range: [Math.min(...visibilityArray)*0.9, Math.max(...visibilityArray) * 1.1],
        title: {
          text: '',
          font: { size: 16 },
        },
      },
      xaxis: {
        range: [Math.min(...velocities)*0.9, Math.max(...velocities)*1.1],
        title: {
          text: 'Velocity [km/h]',
          font: { size: 16 },
        },
      },
    }), [endurances, ranges]
  );

return (
  <div className="sticky top-28">
    <Plot
      data={[
        {
          x: velocities,
          y: endurances,
          type: 'scatter',
          mode: 'lines',
          line: {dash: 'solid'},
          marker: {color: 'red'},
          name: 'Endurance [100*H]',
        },
        {
          x: velocities,
          y: ranges,
          type: 'scatter',
          mode: 'lines',
          line: {dash: 'solid'},
          marker: {color: 'blue'},
          name: 'Range [km]',
        },
      ]}
      layout={layout}
      config={{
        scrollZoom: false,
        responsive: true,
        modeBarButtons: [['toImage']],
        toImageButtonOptions: {
          format: 'png',
          filename: 'initial_endurance',
        },
      }}
    />
  </div>
  );
};

export default PerformanceInitialEnduranceChart;


