import { Plane } from "@react-three/drei";
import { useState } from "react";
import AnimatedHtml from "../../common/three/AnimatedHtml";
import useProfile, { useProfileCamber } from "../hooks/useProfile";
import AnimatedInputTechnical from "../../common/drawings/AnimatedInputTechnical";
import Formula from "../../common/Formula";
import HoverableFormulaColor from "../../common/HoverableFormulaColor";
import AnimatedLine from "../../common/three/AnimatedLine";
import { SpringValue, animated } from "@react-spring/three";
import { useProfileChartsStore } from "../hooks/useProfileCharts";
import useWingScale from "../hooks/useWingScale";
import useProfileSpring from "./hooks/useProfileSpring";
import { CANVAS_WIDTH } from "../../common/three/config";

interface Props {
  opacity?: SpringValue<number>;
}

const ProfileNACAExplanation = ({ opacity }: Props) => {
  const hover = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);

  const show = !(
    !!locked ||
    hover["Coefficient of Lift"] ||
    hover["Coefficient of Drag"]
  );

  const { scaleProfile } = useWingScale();

  const [hoverPlane, setHoverPlane] = useState(false);
  const [hoverA, setHoverA] = useState(false);
  const [hoverB, setHoverB] = useState(false);
  const [hoverC, setHoverC] = useState(false);

  const { M, P, T, F } = useProfileCamber();
  const { maxThickness, lowestPoint } = useProfile();

  const { profileSpring } = useProfileSpring();

  return (
    <animated.mesh
      position-x={profileSpring.gridX.to((x) => (x * CANVAS_WIDTH) / 2)}
      scale={scaleProfile}
    >
      <animated.mesh position-x={profileSpring.x}>
        <Plane
          args={[1.1, 0.5]}
          position-x={0.5}
          position-y={0.1}
          material-transparent
          material-opacity={0}
          onPointerMove={(e) => {}}
          onPointerEnter={(e) => setHoverPlane(true)}
          onPointerLeave={(e) => setHoverPlane(false)}
          onClick={(e) => {}}
          visible={false}
        />
        <AnimatedHtml
          position-x={0.5}
          position-y={0.25}
          show={show && (hoverPlane || hoverA || hoverB || hoverC)}
          scale={1 / scaleProfile}
        >
          <div className="flex text-3xl">
            <HoverableFormulaColor
              name="Maximum camber of the airfoil"
              tex={`${M * 100}`}
              hover={hoverA}
              onEnter={() => setHoverA(true)}
              onLeave={() => setHoverA(false)}
            />
            <HoverableFormulaColor
              name="Position of maximum camber"
              tex={`${P * 10}`}
              hover={hoverB}
              onEnter={() => setHoverB(true)}
              onLeave={() => setHoverB(false)}
            />
            <HoverableFormulaColor
              name="Maximum thickness of the airfoil"
              tex={`${String(T * 100).padStart(2, "0")}`}
              hover={hoverC}
              onEnter={() => setHoverC(true)}
              onLeave={() => setHoverC(false)}
            />
          </div>
        </AnimatedHtml>
        <mesh
          visible={hoverPlane || hoverA || hoverB || hoverC}
          scale={1 / scaleProfile}
          position-z={0.005}
        >
          <mesh visible={hoverA || hoverB}>
            <AnimatedInputTechnical
              scale={scaleProfile}
              distance={-2}
              value={1}
              opacity={0.75}
            >
              <Formula
                className={`text-xl ${hoverA || hoverB || "hidden"}`}
                tex={`1`}
              />
            </AnimatedInputTechnical>
          </mesh>
          <mesh visible={hoverA}>
            <AnimatedInputTechnical
              scale={scaleProfile}
              distance={0.25}
              value={M}
              valueY={-P}
              opacity={0.75}
              vertical
            >
              <div className={`flex text-xl ${hoverA || "hidden"}`}>
                <Formula className={`${M === 0 && "hidden"}`} tex={`0.0`} />
                <Formula className="text-error" tex={`${M * 100}`} />
              </div>
            </AnimatedInputTechnical>
          </mesh>
          <mesh visible={hoverB}>
            <AnimatedInputTechnical
              scale={scaleProfile}
              distance={-1.25}
              value={P}
              valueY={M}
              opacity={0.75}
            >
              <div className={`flex text-xl ${hoverB || "hidden"}`}>
                <Formula className={`${P === 0 && "hidden"}`} tex={`0.`} />
                <Formula className="text-error" tex={`${P * 10}`} />
              </div>
            </AnimatedInputTechnical>
          </mesh>
          <mesh visible={hoverC}>
            <mesh
              position-x={F * scaleProfile}
              position-y={lowestPoint * scaleProfile}
            >
              <AnimatedInputTechnical
                scale={scaleProfile}
                distance={-0.7 * scaleProfile - 0.5}
                value={maxThickness}
                opacity={0.75}
                vertical
              >
                <div className={`flex text-xl ${hoverC || "hidden"}`}>
                  <Formula tex={`0.`} />
                  <Formula
                    className="text-error"
                    tex={`${String(T * 100).padStart(2, "0")}`}
                  />
                </div>
              </AnimatedInputTechnical>
              <AnimatedLine
                points={[
                  [0, 0, 0],
                  [0, maxThickness, 0],
                ]}
                scale={[scaleProfile, scaleProfile, scaleProfile]}
                opacity={0.75}
                width={1.5}
                color="secondary"
                segments
              />
            </mesh>
            <AnimatedInputTechnical
              scale={scaleProfile}
              distance={-1.25}
              value={F}
              valueY={lowestPoint}
              opacity={0.75}
            >
              <div className={`flex text-xl ${hoverC || "hidden"}`}>
                <Formula tex={`${F}`} />
              </div>
            </AnimatedInputTechnical>
          </mesh>
        </mesh>
      </animated.mesh>
    </animated.mesh>
  );
};

export default ProfileNACAExplanation;
