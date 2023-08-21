import { Canvas } from "@react-three/fiber";
import ProfileModal from "./ProfileModal";
import Scene from "./three/Scene";

const Profile = () => {
  return (
    <div className="flex space-x-4 h-full p-6">
      <div className="flex w-full">
        <div className="fixed top-0 left-0 h-screen w-screen">
          <ProfileModal />
          <Canvas camera={{ position: [0, 0, 30], fov: 40 }}>
            {/* <gridHelper rotation-x={Math.PI / 2} /> */}
            <Scene />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default Profile;
