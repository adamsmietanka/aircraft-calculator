import "./App.css";
import Navigation from "./features/navigation/Navigation";
import Steps from "./features/navigation/Steps";
import { useAwaitClickStore } from "./features/navigation/stores/useAwaitClick";

function App() {
  const continueAnimation = useAwaitClickStore(
    (state) => state.continueAnimation
  );
  const next = useAwaitClickStore((state) => state.next);
  
  return (
    <div
      className="flex"
      onClick={() => {
        console.log(123, next);
        continueAnimation();
      }}
    >
      <Navigation />
      <div className="flex flex-col w-full">
        <Steps />
      </div>
    </div>
  );
}

export default App;
