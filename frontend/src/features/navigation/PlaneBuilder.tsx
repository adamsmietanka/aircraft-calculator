import { Canvas } from "@react-three/fiber";
import ProfileModal from "../aerodynamics/ProfileModal";
import Route from "./Route";
import Profile from "../aerodynamics/three/Profile";
import Wing from "../aerodynamics/three/Wing";
import Fuselage from "../aerodynamics/three/Fuselage";
import Home from "./Home";
import Camera from "../common/three/Camera";
import { Perf } from "r3f-perf";
import { checkVisible } from "../common/three/checkVisible";
import InducedDrag from "../aerodynamics/three/tutorials/InducedDrag";
import { OrbitControls } from "@react-three/drei";
import ProfileNACAExplanation from "../aerodynamics/three/ProfileNACAExplanation";
import Introduction from "../aerodynamics/three/tutorials/Introduction";
import ProfileVisualizer from "../aerodynamics/three/ProfileVisualizer";
import LevelFlight from "../aerodynamics/three/tutorials/LevelFlight";

const PlaneBuilder = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-screen">
      <ProfileModal />
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
        <OrbitControls enabled={false} />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 10, 0]} intensity={0.5} />

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
            "/aerodynamics/wing",
          ]}
          Element={ProfileVisualizer}
        />
        <Route path="/aerodynamics/levelFlight" Element={LevelFlight} />
        <Route path="/aerodynamics/wing" Element={Wing} />
        <Route path="/aerodynamics/inducedDrag" Element={InducedDrag} />
        <Route path="/aerodynamics/fuselage" Element={Fuselage} />
      </Canvas>
    </div>
  );
};

export default PlaneBuilder;
