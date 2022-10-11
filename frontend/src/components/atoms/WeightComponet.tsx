import { useState } from "react";


interface Component {
  name: string;
  mass: number;
  x: number;
  y: number;
  z: number;
//   edit:() => (boolean);
}
const WeightComponet = ({ name, mass, x, y, z  }: Component) => {
    
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <div className="flex flex-col">
            <p>Mass: {mass} kg </p>
            <div className="flex flex-row"></div>
            <p> x = {x} m </p>
            <p> y = {y} m </p>
            <p> z = {z} m </p>
        </div>
      </div>
      <div className="card-actions justify-end">
        <button className="btn btn-primary" >Edit</button>
        <button className="btn btn-primary">Delete</button>
      </div>
    </div>
  );
};

export default WeightComponet;
