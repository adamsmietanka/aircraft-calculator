interface Props {
    label: string;
    unit: string;
    value: number;
    min: number;
    max: number;
    step: number;
    setter: (value: number) => void;  
}

const InputSlider = ({label, unit, value, min, max, step, setter}: Props) => {
  return (
    <div className="form-control">
        <label className="label">
            <span className="label-text">{label}</span>
        </label>
        <label className='flex items-center'>
            <div className='flex w-48 pr-1'>
                <input 
                    type="range" 
                    min={min} 
                    max={max} 
                    step={step}
                    value={value} 
                    onChange={(e) => setter(parseFloat(e.target.value))}
                    className="range w-48 range-xs"
                    />
            </div>
            <span className='flex items-center justify-center bg-gray-200 px-1 w-20 rounded-lg h-12'>
                {value} {unit}
            </span>
        </label>   
    </div>
    
  )
}

export default InputSlider