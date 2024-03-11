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
import {
  FaceControls,
  FaceLandmarker,
  KeyboardControls,
  KeyboardControlsEntry,
  OrbitControls,
  StatsGl,
} from "@react-three/drei";
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
import LevelFlightFormula from "../aerodynamics/three/tutorials/LevelFlightFormula";
import NavigationElliptic from "../compass/NavigationElliptic";
import FuselageUI from "../aerodynamics/three/FuselageUI";
import VerticalUI from "../aerodynamics/three/VerticalUI ";
import HorizontalUI from "../aerodynamics/three/HorizontalUI";
import GlideUI from "../aerodynamics/three/GlideUI";
import ResultsUI from "../aerodynamics/three/ResultsUI";
import { useMemo } from "react";

export enum Controls {
  left = "left",
  right = "right",
  up = "up",
  down = "down",
}

const PlaneBuilder = () => {
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.up, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.down, keys: ["ArrowDown", "KeyS"] },
    ],
    []
  );
  return (
    <div className="fixed top-0 left-0 h-screen w-screen">
      <ProfileModal />
      <IntroBernoulli />
      <IntroNewton2nd />
      <IntroMisconception />
      <LevelFlightFormula />
      <Subtitle />
      {/* <DebugHeadless /> */}
      <KeyboardControls map={map}>
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
          <FaceLandmarker>
            {/* <FaceControls offsetScalar={2} smoothTime={0.75} /> */}
            {/* <StatsGl className="ml-20" /> */}
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
            <Route
              paths={["/aerodynamics/introduction"]}
              Element={Introduction}
            />
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
            <Route
              paths={[
                "/aerodynamics/fuselage",
                "/aerodynamics/vertical",
                "/aerodynamics/horizontal",
                "/aerodynamics/results",
              ]}
              Element={Fuselage}
            />
            <Route path="/aerodynamics/fuselage" Element={FuselageUI} />
            <Route path="/aerodynamics/vertical" Element={VerticalUI} />
            <Route path="/aerodynamics/horizontal" Element={HorizontalUI} />
            <Route path="/aerodynamics/results" Element={ResultsUI} />
            <Route path="/aerodynamics/glide" Element={GlideUI} />
            <Route
              path="/navigation/hyperbolic"
              Element={NavigationHyperbolic}
            />
            <Route path="/navigation/elliptic" Element={NavigationElliptic} />
          </FaceLandmarker>
        </Canvas>
      </KeyboardControls>
    </div>
  );
};

export default PlaneBuilder;
