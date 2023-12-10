import { Canvas } from "@react-three/fiber";
import ProfileModal from "../aerodynamics/ProfileModal";
import Route from "./Route";
import Profile from "../aerodynamics/three/Profile";
import Wing from "../aerodynamics/three/Wing";
import Fuselage from "../aerodynamics/three/Fuselage";
import Home from "./Home";
import Camera from "../common/three/Camera";
import { Perf, PerfHeadless, usePerf } from "r3f-perf";
import { checkVisible } from "../common/three/checkVisible";
import InducedDrag from "../aerodynamics/three/tutorials/InducedDrag";
import { OrbitControls } from "@react-three/drei";
import ProfileNACAExplanation from "../aerodynamics/three/ProfileNACAExplanation";
import Introduction from "../aerodynamics/three/tutorials/Introduction";
import ProfileVisualizer from "../aerodynamics/three/ProfileVisualizer";
import LevelFlight from "../aerodynamics/three/tutorials/LevelFlight";
import Subtitle from "../common/subtitles/Subtitle";
import NavigationHyperbolic from "../compass/NavigationHyperbolic";
import IntroBernoulli from "../aerodynamics/three/tutorials/IntroBernoulli";
import IntroNewton2nd from "../aerodynamics/three/tutorials/IntroNewton2nd";
import IntroMisconception from "../aerodynamics/three/tutorials/IntroMisconception";
import DebugHeadless from "./Perf";



const PlaneBuilder = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-screen">
      <ProfileModal />
      <IntroBernoulli />
      <IntroNewton2nd />
      <IntroMisconception />
      <Subtitle />
      {/* <DebugHeadless /> */}
      <Canvas
        flat
        camera={{ position: [0, -200, 200], fov: 60 }}
        onCreated={(state) => {
          state.setEvents({
            filter: (intersections) =>
              intersections.filter((i) => checkVisible(i.object)),
          });
        }}
      >
        {/* <Perf /> */}
        {/* <gridHelper rotation-x={Math.PI / 2} position-x={-5}/> */}
        <OrbitControls enabled={false} />
        <ambientLight intensity={0.1} />
        <pointLight position={[-10, 10, 0]} intensity={100} />
        <spotLight position={[-10, -40, 70]} intensity={1000} />
        <spotLight position={[-10, 10, 70]} intensity={1000} />

        <Camera />

        <Route paths={["/", "/aerodynamics/profile"]} Element={Home} />
        <Route path="/aerodynamics/profile" Element={Profile} />
        <Route
          paths={["/aerodynamics/introduction", "/aerodynamics/profile"]}
          Element={ProfileNACAExplanation}
        />
        <Route paths={["/aerodynamics/introduction"]} Element={Introduction} />
        <Route
          paths={[
            "/aerodynamics/introduction",
            "/aerodynamics/profile",
            "/aerodynamics/levelFlight",
            "/aerodynamics/inducedDrag",
            "/aerodynamics/wing",
          ]}
          Element={ProfileVisualizer}
        />
        <Route path="/aerodynamics/levelFlight" Element={LevelFlight} />
        <Route path="/aerodynamics/inducedDrag" Element={InducedDrag} />
        <Route path="/aerodynamics/wing" Element={Wing} />
        <Route path="/aerodynamics/fuselage" Element={Fuselage} />
        <Route path="/navigation/hyperbolic" Element={NavigationHyperbolic} />
      </Canvas>
    </div>
  );
};

export default PlaneBuilder;
