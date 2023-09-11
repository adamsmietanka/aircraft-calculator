import { useLocation } from "react-router-dom";
import SceneFuselage from "./SceneFuselage";
import SceneHome from "./SceneHome";
import SceneProfile from "./SceneProfile";
import SceneWing from "./SceneWing";
import { Perf } from "r3f-perf";
import useCamera from "./hooks/useCamera";

const Scene = () => {
  const location = useLocation();

  const onProfileStep = location.pathname === "/aerodynamics/profile";
  const onWingStep = location.pathname === "/aerodynamics/wing";
  const onFuselageStep = location.pathname === "/aerodynamics/fuselage";
  const { s } = useCamera();
  return (
    <>
      <Perf />
      <SceneHome />
      {(onProfileStep || onWingStep) && <SceneProfile />}
      {onWingStep && <SceneWing />}
      {onFuselageStep && <SceneFuselage />}
    </>
  );
};

export default Scene;
