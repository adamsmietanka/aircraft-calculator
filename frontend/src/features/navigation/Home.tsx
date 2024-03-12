import {
  Center,
  Cloud,
  Clouds,
  Float,
  Text3D,
  Instances,
  Instance,
  Cylinder,
  Wireframe,
  PresentationControls,
} from "@react-three/drei";
import useLandingPage from "./hooks/useLandingPage";
import { useEffect, useMemo, useState } from "react";
import { MeshStandardMaterial } from "three";
import Contact from "./Contact";
import { animated, easings, useSpring } from "@react-spring/three";
import Inputs3D from "../common/three/Inputs3D";
import Arrow from "../../assets/arrow.svg?react";
import { useCameraStore } from "../common/three/stores/useCamera";

const SPAR_DIAMETER = 0.03;

const Home = () => {
  const setCamera = useCameraStore((state) => state.set);

  const { geom1, geom2, vertical, elliptic, tail, tailSquare, fuse1, fuse2 } =
    useLandingPage();

  const material = useMemo(() => {
    return new MeshStandardMaterial({ metalness: 0.5 });
  }, []);

  const [diagram, setDiagram] = useState(false);

  const [spring] = useSpring(
    () => ({
      bearing: diagram ? [8, 0, 0] : [0.35, 0, 0],
      tank: diagram ? [6, 0, 0] : [0, 0, 0.6],
      filter1: diagram ? [7, 0, 0.6] : [-0.25, -0.5, 0.1],
      filter2: diagram ? [7.5, 0, 0.6] : [0.25, -0.5, 0.1],
      config: {
        duration: 1500,
        easing: easings.easeOutQuad,
      },
    }),
    [diagram]
  );

  useEffect(() => {
    if (diagram) setCamera({ center: [8, 0, 0], spherical: [10, 0, 0] });
    else setCamera({ center: [0, 0, 0], spherical: [15, 80, 45] });
  }, [diagram]);

  return (
    <mesh receiveShadow>
      <PresentationControls
        enabled={!diagram} // the controls can be disabled by setting this to false
        global={false} // Spin globally or by dragging the model
        cursor={true} // Whether to toggle cursor style on drag
        snap={true} // Snap-back to center (can also be a spring config)
        speed={1} // Speed factor
        zoom={1.25} // Zoom factor when half the polar-max is reached
        rotation={[0, 0, 0]} // Default rotation
        polar={[-Math.PI / 8, Math.PI / 16]} // Vertical limits
        azimuth={[-Math.PI / 2, Math.PI / 2]} // Horizontal limits
        config={{ mass: 1, tension: 170, friction: 26 }}
      >
        <mesh rotation-x={-Math.PI / 3}>
          <Inputs3D gridPositionX={0.3}>
            <button
              className="btn normal-case"
              onClick={() => setDiagram(() => !diagram)}
            >
              {diagram ? (
                <>
                  <Arrow className="transform rotate-180" />
                  Real
                </>
              ) : (
                <>
                  Diagram
                  <Arrow />
                </>
              )}
            </button>
          </Inputs3D>
        </mesh>
        <mesh
          position={[2, 0.75, -4]}
          receiveShadow
          scale={[-2, 2, 2]}
          // rotation={[-Math.PI / 16, 0, 0]}
        >
          <mesh geometry={geom1} material={material} />

          <mesh
            scale={9}
            scale-x={10.5}
            position-x={-1.5}
            geometry={fuse1}
            material={material}
          />
          <mesh
            position-x={7.5}
            position-y={0.65}
            rotation-x={-Math.PI / 2}
            geometry={vertical}
            material={material}
          />
          <mesh
            position-x={8.1}
            position-y={1.95}
            geometry={tailSquare}
            material={material}
          />
        </mesh>
        <mesh scale={1.6}>
          <mesh rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.5, 0.5, 1.2, 32]} />
            <meshPhongMaterial />
            <Wireframe
              simplify // Remove some edges from wireframes
              fill={"#e3e3e3"} // Color of the inside of the wireframe
              fillMix={0.5} // Mix between the base color and the Wireframe 'fill'. 0 = base; 1 = wireframe
              fillOpacity={0.1} // Opacity of the inner fill
              stroke={"202020"} // Color of the stroke
              strokeOpacity={1} // Opacity of the stroke
              thickness={0.04} // Thinkness of the lines
              colorBackfaces={false} // Whether to draw lines that are facing away from the camera
              backfaceStroke={"#e3e3e3"} // Color of the lines that are facing away from the camera
            />
          </mesh>
          <animated.mesh rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.07, 0.07, 1, 32]} />
            <meshPhongMaterial />
          </animated.mesh>
          <animated.mesh position={spring.bearing}>
            <mesh rotation-z={Math.PI / 2}>
              <cylinderGeometry args={[0.1, 0.1, 0.15, 32]} />
              <meshPhongMaterial color="grey" />
            </mesh>
          </animated.mesh>
          <animated.mesh position={spring.tank}>
            <boxGeometry args={[0.5, 0.25, 0.25]} />
            <meshPhongMaterial color="white" />
          </animated.mesh>
          <animated.mesh position={spring.filter1}>
            <cylinderGeometry args={[0.1, 0.1, 0.15, 32]} />
            <meshPhongMaterial color="purple" />
          </animated.mesh>
          <animated.mesh position={spring.filter2}>
            <cylinderGeometry args={[0.1, 0.1, 0.15, 32]} />
            <meshPhongMaterial color="purple" />
          </animated.mesh>
        </mesh>
      </PresentationControls>
    </mesh>
  );
};

export default Home;
