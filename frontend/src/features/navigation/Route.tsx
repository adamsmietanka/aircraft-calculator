import React from "react";
import { useLocation } from "react-router-dom";

interface Props {
  path?: string;
  paths?: string[];
  element: JSX.Element;
}

const Route = ({ path, paths, element }: Props) => {
  const location = useLocation();
  const pathsArray = paths ? paths : [path];
  return (
    <mesh visible={pathsArray.some((p) => location.pathname === p)}>
      {element}
    </mesh>
  );
};

export default Route;
