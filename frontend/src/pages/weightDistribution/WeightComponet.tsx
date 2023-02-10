import WeightComponent from "./interfaces/weightComponent";


interface Component {
  name: string;
  mass: number;
  cords: { x: number; y: number; z: number };
  handleDelete: (component: WeightComponent) => void;
  handleEdit: (component: WeightComponent) => void;
}

const WeightComponet = ({ name, mass, cords, handleDelete,handleEdit }: Component) => {
  return (
    <div className="card card-bordered mb-2 card-compact">
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <div className="flex flex-col">
          <p> Mass: {mass} kg </p>
          <div className="flex flex-row">
            <p> x = {cords.x} m </p>
            <p> y = {cords.y} m </p>
            <p> z = {cords.z} m </p>
          </div>
        </div>
      </div>
      <div className="card-actions mb-2 justify-center">
        <label className="btn btn-warning" htmlFor="my-modal" onClick={() => handleEdit({ componentName:name, mass:mass, cords:cords})}>Edit</label>
        <button className="btn btn-error " onClick={() => handleDelete({ componentName:name, mass:mass, cords:cords})}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default WeightComponet;
