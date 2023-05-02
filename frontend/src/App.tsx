import "./App.css";
import { Outlet } from "react-router-dom";
import Navigation from "./components/molecules/Navigation";

function App() {
  return (
    <div className="flex">
      <Navigation />
      <div className="flex flex-col w-full ml-80">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
