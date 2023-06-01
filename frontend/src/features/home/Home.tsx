import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center text-lg">
      <div>
        This is the <b>Aircraft Calculator</b>
      </div>
      <div>Ultimate tool for aircraft design and optimization</div>
      <div>The project is currently underway</div>
      <div>
        Go to{" "}
        <Link to="powerunit/engine" className="link">
          Power Unit
        </Link>{" "}
        to start
      </div>
    </div>
  );
};

export default Home;
