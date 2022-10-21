interface Props {
    label: string;
    type: string;
    option1: string;
    option2: string;
    setter: (value: string) => void;  
}

const SelectType = ({label, type, option1, option2, setter}: Props) => {

  return (
    <div className="form-control w-64">
            <label className="label">
              <span className="label-text">{label}</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={type}
              name="type"
              id="typeselect"
              onChange={(e) => setter(e.target.value)}
            >
              <option value={option1}>{option1}</option>
              <option value={option2}>{option2}</option>
            </select>
          </div>
  )
}



export default SelectType