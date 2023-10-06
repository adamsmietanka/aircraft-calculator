import "./App.css";
import Navigation from "./features/navigation/Navigation";
import Steps from "./features/navigation/Steps";

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
