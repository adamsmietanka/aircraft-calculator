import { Canvas } from "@react-three/fiber";
import ProfileModal from "../aerodynamics/ProfileModal";
import Route from "./Route";
import Profile from "../aerodynamics/three/Profile";
import Wing from "../aerodynamics/three/Wing";
import Fuselage from "../aerodynamics/three/Fuselage";
import Home from "./Home";
import Camera from "../common/three/Camera";
import { Perf } from "r3f-perf";
import ProfileOutline from "../aerodynamics/three/ProfileOutline";

const PlaneBuilder = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-screen">
      <ProfileModal />
      <Canvas camera={{ position: [0, -100, 200], fov: 60 }}>
        <Perf />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 10, 0]} intensity={0.5} />

        <Camera />

        <Route paths={["/", "/aerodynamics/profile"]} element={<Home />} />
        <Route path="/aerodynamics/profile" element={<Profile />} />
        <Route
          paths={["/", "/aerodynamics/profile", "/aerodynamics/wing"]}
          element={<ProfileOutline size={[0.33, 1]} gridPositionX={-1.33} />}
        />
        <Route path="/aerodynamics/wing" element={<Wing />} />
        <Route path="/aerodynamics/fuselage" element={<Fuselage />} />
      </Canvas>
    </div>
  );
};

export default PlaneBuilder;
