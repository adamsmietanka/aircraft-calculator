import WeightComponent from "./interfaces/weightComponent";

interface Component {
  name: string;
  mass: number;
  x: number;
  y: number;
  z: number;
  handleDelete: (component: WeightComponent) => void;
  handleEdit: (component: WeightComponent) => void;
}

const WeightComponet = ({
  name,
  mass,
  x,
  y,
  z,
  handleDelete,
  handleEdit,
}: Component) => {
  return (
    <tr className="hover">
      <th> {name} </th>
      <th> {mass} </th>
      <th> {x} </th>
      <th> {y} </th>
      <th> {z} </th>
      <th>
        <label
          className="btn bg-yellow-600"
          htmlFor="my-modal"
          onClick={() =>
            handleEdit({ componentName: name, mass: mass, x: x, y: y, z: z })
          }
        >
          Edit
        </label>
      </th>
      <th>
        <button
          className="btn bg-red-600 "
          onClick={() =>
            handleDelete({ componentName: name, mass: mass, x: x, y: y, z: z })
          }
        >
          Delete
        </button>
      </th>
    </tr>
  );
};

export default WeightComponet;
