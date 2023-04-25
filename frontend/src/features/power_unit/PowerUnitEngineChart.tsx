import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useEngineStore } from "./useEngine";
import { usePower } from "./usePower";
import Plot from 'react-plotly.js';

const PowerUnitEngineChart = () => {
  const seaLevelPower = useEngineStore((state) => state.seaLevelPower);
  const engineSpeed = useEngineStore((state) => state.engineSpeed);
  const reductionRatio = useEngineStore((state) => state.reductionRatio);
  const heights = useEngineStore((state) => state.heights);
  const [calculatePower] = usePower();
  const [powers, setPowers] = useState(heights.map(calculatePower));

  useEffect(() => {
    console.log(heights.map(calculatePower)[0])
    setPowers(heights.map(calculatePower));
  }, [calculatePower, heights]);

  const layout = useMemo(() => ({
    title: 'Engine performance',
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
        text: 'Engine Power [kW]',
        font: { size: 16 },
      },
    },
    xaxis: {
      // range: [0, this.engine.maxAltitude],
      title: {
        text: 'Altitude [km]',
        font: { size: 16 },
      },
    },
  }), [powers])

  return (
    <Plot
        data={[
          {
            x: heights,
            y: powers,
            type: 'scatter',
            mode: 'lines',
            marker: {color: 'red'},
          },
        ]}
        layout={layout}
      />
  );
};

export default PowerUnitEngineChart;
