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
import { useWingStore } from "../stores/useWing";
import { useIntroductionStore } from "../stores/useIntroduction";
import { useLocation } from "react-router-dom";

interface Props {
  opacity?: SpringValue<number>;
}

const ProfileNACAExplanation = ({ opacity }: Props) => {
  const hover = useProfileChartsStore((state) => state.hover);
  const locked = useProfileChartsStore((state) => state.locked);
  const location = useLocation();

  const onProfile = location.pathname === "/aerodynamics/profile";

  const profile = onProfile
    ? useWingStore((state) => state.profile)
    : useIntroductionStore((state) => state.profile);

  const hoverPlane = useIntroductionStore((state) => state.hoverPlane);
  const hoverA = useIntroductionStore((state) => state.hoverA);
  const hoverB = useIntroductionStore((state) => state.hoverB);
  const hoverC = useIntroductionStore((state) => state.hoverC);
  const set = useIntroductionStore((state) => state.set);

  const show = !(
    !!locked ||
    hover["Coefficient of Lift"] ||
    hover["Coefficient of Drag"]
  );

  const { scaleProfile } = useWingScale();

  const { M, P, T, F } = useProfileCamber(profile);
  const { maxThickness, lowestPoint, highestPoint } = useProfile(profile);

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
          onPointerEnter={(e) => onProfile && set({ hoverPlane: true })}
          onPointerLeave={(e) => onProfile && set({ hoverPlane: false })}
          onClick={(e) => {}}
          visible={false}
        />
        <AnimatedHtml
          position-x={0.5}
          position-y={0.25}
          show={
            (!onProfile || show) && (hoverPlane || hoverA || hoverB || hoverC)
          }
          scale={1 / scaleProfile}
        >
          <div className="flex text-3xl">
            <HoverableFormulaColor
              name="Maximum camber of the airfoil"
              tex={`${M * 100}`}
              hover={hoverA}
              onEnter={() => onProfile && set({ hoverA: true })}
              onLeave={() => onProfile && set({ hoverA: false })}
            />
            <HoverableFormulaColor
              name="Position of maximum camber"
              tex={`${P * 10}`}
              hover={hoverB}
              onEnter={() => onProfile && set({ hoverB: true })}
              onLeave={() => onProfile && set({ hoverB: false })}
            />
            <HoverableFormulaColor
              name="Maximum thickness of the airfoil"
              tex={`${String(T * 100).padStart(2, "0")}`}
              hover={hoverC}
              onEnter={() => onProfile && set({ hoverC: true })}
              onLeave={() => onProfile && set({ hoverC: false })}
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
            <mesh position-x={F * scaleProfile}>
              <AnimatedInputTechnical
                scale={scaleProfile}
                distance={-0.7 * scaleProfile - 0.6}
                value={maxThickness}
                startX={lowestPoint}
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
                  [0, lowestPoint, 0],
                  [0, highestPoint, 0],
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
