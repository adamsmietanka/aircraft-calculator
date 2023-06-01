interface Props {
  label: string;
  unit: string;
  value: number;
  setter: (value: number) => void;
  step?: number;
}


const InputNumber = ({label, unit, value, setter, step}: Props) => {

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <label className="input-group flex items-center">
        <input
          className="input input-bordered w-48"
          type="number"
          step={step ? step :10}
          value={value}
          onChange={(e) => setter(parseFloat(e.target.value))}
        />
        <span className="flex items-center justify-center bg-gray-200 px-1 w-20 rounded-lg h-12">
          {unit}
        </span>
      </label>
    </div>
  );
};

export default InputNumber;
