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
import AnimatedLine from "../common/three/AnimatedLine";

const transform = (point: number[], { x = 0, y = 0, z = 0 }) => [
  point[0] + x,
  point[1] + y,
  point[2] + z,
];

const override = (
  point: number[],
  { x, y, z }: { x?: number; y?: number; z?: number }
) => [x ?? point[0], y ?? point[1], z ?? point[2]];

const crank = { old: [0, 0, 0], new: [1.35, 0, -0.5] };
const bearing = { old: [-0.35, 0, 0], new: [1, 0, -0.5] };
const bearing2 = { old: [0.35, 0, 0], new: [1.7, 0, -0.5] };
const tank = { old: [0, 0, 0.6], new: [-1, 0, 0] };
const filter1 = { old: [-0.25, -0.5, 0.1], new: [0, 0, 0.8] };
const filter2 = { old: [0.25, -0.5, 0.1], new: [0.5, 0, 0.8] };

const b1 = transform(bearing.new, { z: -0.5 });
const b2 = transform(bearing2.new, { z: -0.5 });
const t1 = transform(tank.new, { z: 0.5 });
const t2 = transform(tank.new, { z: -0.5 });
const f1 = transform(filter1.new, { z: 0.75 });
const f2 = transform(filter2.new, { z: 0.5 });

const pointsDiagram = [
  bearing.new,
  b1,
  override(b1, { x: tank.new[0] - 0.35 }),
  transform(t1, { x: -0.35 }),
  t1,
  tank.new,
  t2,
  override(t2, { x: filter1.new[0] }),
  filter1.new,
  f1,
  override(f1, { x: bearing.new[0] }),
  bearing.new,
];

const pointsDiagram2 = [
  override(t1, { x: filter1.new[0] }),
  override(t1, { x: filter2.new[0] }),
  filter2.new,
  f2,
  override(f2, { x: bearing2.new[0] }),
  bearing2.new,
  b2,
  b1,
];

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
      all: diagram ? 6 : 0,
      crank: diagram ? crank.new : crank.old,
      bearing: diagram ? bearing.new : bearing.old,
      bearing2: diagram ? bearing2.new : bearing2.old,
      tank: diagram ? tank.new : tank.old,
      tankRotation: diagram ? Math.PI / 2 : 0,
      filter1: diagram ? filter1.new : filter1.old,
      filter2: diagram ? filter2.new : filter2.old,
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
          <animated.mesh position-x={spring.all}>
            <animated.mesh rotation-z={Math.PI / 2} position={spring.crank}>
              <cylinderGeometry args={[0.07, 0.07, 1, 32]} />
              <meshPhongMaterial />
            </animated.mesh>
            <animated.mesh position={spring.bearing}>
              <mesh rotation-z={Math.PI / 2}>
                <cylinderGeometry args={[0.1, 0.1, 0.15, 32]} />
                <meshPhongMaterial color="grey" />
              </mesh>
            </animated.mesh>
            <animated.mesh position={spring.bearing2}>
              <mesh rotation-z={Math.PI / 2}>
                <cylinderGeometry args={[0.1, 0.1, 0.15, 32]} />
                <meshPhongMaterial color="grey" />
              </mesh>
            </animated.mesh>
            <animated.mesh
              position={spring.tank}
              rotation-y={spring.tankRotation}
            >
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

            <AnimatedLine
              points={diagram ? pointsDiagram : pointsDiagram}
              opacity={diagram ? 1 : 0}
              style="dotted"
              color="grid"
            />

            <AnimatedLine
              points={pointsDiagram2}
              opacity={diagram ? 1 : 0}
              style="dotted"
              color="grid"
            />
          </animated.mesh>
        </mesh>
      </PresentationControls>
    </mesh>
  );
};

export default Home;
