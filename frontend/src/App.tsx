import "./App.css";
import Navigation from "./features/navigation/Navigation";
import Steps from "./features/navigation/Steps";
import { useAnimationStore } from "./features/common/subtitles/stores/useAnimation";

function App() {
  const increaseCounter = useAnimationStore((state) => state.increaseCounter);

  return (
    <div className="flex" onClick={increaseCounter}>
      <Navigation />
      <div className="flex flex-col w-full">
        <Steps />
      </div>
    </div>
  );
}

export default App;
