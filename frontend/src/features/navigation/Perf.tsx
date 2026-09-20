import { useThree } from "@react-three/fiber";
import { PerfHeadless, usePerf } from "r3f-perf";

/** r3f-perf types `usePerf` as `(sel) => unknown`, so its results have to be
 *  narrowed here. Both are plain numbers at runtime. */
type PerfLog = Record<string, number>;
type PerfReport = { sessionTime: number; log: PerfLog };

const Measurements = ({ log }: { log: PerfLog }) => (
  <>
    {Object.entries(log).map(([key, val]) => (
      <div key={key}>
        {key}: {val.toFixed(3)}
      </div>
    ))}
  </>
);

const DebugHeadless = () => {
  const log = usePerf((s) => s.log) as PerfLog | undefined;
  const getReport = usePerf((s) => s.getReport) as () => PerfReport;

  const report = getReport();

  return (
    <div className="absolute left-20">
      <b>LOG Realtime:</b>
      <code>{log && <Measurements log={log} />}</code>
      <br />
      <br />
      <b>REPORT: Data gathered for {report.sessionTime.toFixed(2)}s</b>
      <br />
      <code>
        average:
        <Measurements log={report.log} />
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
