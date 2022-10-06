import React from 'react'

interface Props {
    label: string;
    unit: string;
    value: number;
    setter: (value: number) => void;  
}

const SliderInput = ({label, unit, value, setter}: Props) => {
  return (
    <div className="form-control">
        <label className="label">
            <span className="label-text">{label}</span>
        </label>
        <input 
            type="range" 
            min="0" max="10000" step="100"
            value={value} 
            onChange={(e) => setter(parseFloat(e.target.value))}
            className="range range-primary"/>

        <div className="stats shadow" >
            <div className="stat">
                <div className="stat-value">{value} {unit}</div>   
            </div>
        </div>
    </div>
    
  )
}

export default SliderInput