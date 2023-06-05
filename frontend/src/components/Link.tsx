import React from "react";
import { NavLink } from "react-router-dom";

interface LinkProps {
  to: string;
  children: React.ReactNode;
}

const Link = ({ to, children }: LinkProps) => (
  <NavLink to={to}>
    {({ isActive }) => (
      <button
        className={`btn btn-block btn-ghost justify-start ${
          isActive && "bg-base-span"
        }`}
      >
        {children}
      </button>
    )}
  </NavLink>
);

export default Link;
