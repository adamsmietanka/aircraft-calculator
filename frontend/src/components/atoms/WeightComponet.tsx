import { useState } from "react";

interface Component {
  name: string;
  mass: number;
  cords: { x: number; y: number; z: number };
  //   edit:() => (boolean);
}
const WeightComponet = ({ name, mass, cords }: Component) => {
  return (
    <div className="card card-bordered mb-2 card-compact">
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <div className="flex flex-col">
          <p>Mass: {mass} kg </p>
          <div className="flex flex-row">
            <p> x = {cords.x} m </p>
            <p> y = {cords.y} m </p>
            <p> z = {cords.z} m </p>
          </div>
        </div>
      </div>
      <div className="card-actions mb-2 justify-center">
        <button className="btn btn-warning">Edit</button>
        <button className="btn btn-error ">Delete</button>
      </div>
    </div>
  );
};

export default WeightComponet;
