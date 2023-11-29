import { ReactComponent as PadlockIcon } from "../../assets/padlock.svg";

interface Props {
  locked: boolean;
  setLocked: (value: boolean) => void;
}

const Padlock = ({ locked, setLocked }: Props) => {
  return (
    <span className="cursor-pointer" onClick={() => setLocked(!locked)}>
      <div
        className="tooltip w-7 z-50"
        data-tip="Locking makes the value computed from the graph. Unlocking enables manual input"
      >
        <PadlockIcon className={`lock ${locked && "locked"}`} />
      </div>
    </span>
  );
};

export default Padlock;
