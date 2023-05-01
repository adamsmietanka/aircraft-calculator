import { useState } from "react";

interface Switch {
    proptype: string;
    setter: (value: string) => void; 
}


const SwitchType = ({proptype, setter}: Switch) => {
  
    const onSubmit = (e: React.FormEvent) => {
    console.log(proptype);
  };

  return (
    <form className="add-form" onSubmit={onSubmit}>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Select propulsion type</span>
        </label>
        <select
          className="select select-bordered w-full max-w-xs"
          value={proptype}
          name="proptype"
          id="propselect"
          onChange={(e) => setter(e.target.value)}
        >
          <option value="propeller">Propeller</option>
          <option value="jet">Jet</option>
        </select>
      </div>
      <input type="submit" value="Save propulsion type" className="btn w-full bg-gray-200 px-1 rounded-lg h-12" />
    </form>
  );
};

export default SwitchType;
