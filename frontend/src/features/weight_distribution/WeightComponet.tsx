import WeightComponent from "./interfaces/weightComponent";

interface Component {
  name: string;
  mass: number;
  cords: { x: number; y: number; z: number };
  handleDelete: (component: WeightComponent) => void;
  handleEdit: (component: WeightComponent) => void;
}

const WeightComponet = ({
  name,
  mass,
  cords,
  handleDelete,
  handleEdit,
}: Component) => {
  return (
    <tr className="hover">
      <th> {name} </th>
      <th> {mass} </th>
      <th> {cords.x} </th>
      <th> {cords.y} </th>
      <th> {cords.z} </th>
      <th>
        <label
          className="btn bg-yellow-600"
          htmlFor="my-modal"
          onClick={() =>
            handleEdit({ componentName: name, mass: mass, cords: cords })
          }
        >
          Edit
        </label>
      </th>
      <th>
        <button
          className="btn bg-red-600 "
          onClick={() =>
            handleDelete({ componentName: name, mass: mass, cords: cords })
          }
        >
          Delete
        </button>
      </th>
    </tr>
  );
};

export default WeightComponet;
