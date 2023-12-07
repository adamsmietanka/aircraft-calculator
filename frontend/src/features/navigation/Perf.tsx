import { useThree } from "@react-three/fiber";
import { PerfHeadless, usePerf } from "r3f-perf";

const DebugHeadless = () => {
  const [log, getReport] = usePerf((s) => [s.log, s.getReport]);
  return (
    <div className="absolute left-20">
      <b>LOG Realtime:</b>
      <code>
        {log &&
          Object.entries(log).map(([key, val]) => (
            <div>
              {key}: {parseFloat(val).toFixed(3)}
            </div>
          ))}
      </code>
      <br />
      <br />
      <b>
        REPORT: Data gathered for{" "}
        {parseFloat(getReport().sessionTime).toFixed(2)}s
      </b>
      <br />
      <code>
        average:
        {Object.entries(getReport().log).map(([key, val]) => (
          <div>
            {key}: {parseFloat(val).toFixed(3)}
          </div>
        ))}
      </code>
    </div>
  );
};
const Debug = () => {
  const { width } = useThree((s) => s.size);
  return (
    /* This is it -> */
    <PerfHeadless minimal={width < 712} />
  );
};

export default DebugHeadless;
