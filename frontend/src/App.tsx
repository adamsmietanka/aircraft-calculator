import "./App.css";
import { Outlet } from "react-router-dom";
import Navigation from "./components/ui/Navigation";

function App() {
  return (
    <div className="flex">
      <Navigation />
      <div className="m-4 flex flex-col w-full">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
