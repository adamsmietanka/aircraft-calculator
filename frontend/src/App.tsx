import "./App.css";
import Navigation from "./components/Navigation";
import Steps from "./components/Steps";

function App() {
  return (
    <div className="flex">
      <Navigation />
      <div className="flex flex-col w-full">
        <Steps />
      </div>
    </div>
  );
}

export default App;
