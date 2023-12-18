import "./App.css";
import Navigation from "./features/navigation/Navigation";
import Steps from "./features/navigation/Steps";
import { useAwaitClickStore } from "./features/common/subtitles/stores/useAwaitClick";

function App() {
  const continueAnimation = useAwaitClickStore(
    (state) => state.continueAnimation
  );
  const increaseCounter = useAwaitClickStore((state) => state.increaseCounter);

  return (
    <div
      className="flex"
      onClick={() => {
        continueAnimation();
        increaseCounter();
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
