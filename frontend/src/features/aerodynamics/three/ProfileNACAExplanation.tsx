import { Plane } from "@react-three/drei";
import { useState } from "react";
import AnimatedHtml from "../../common/three/AnimatedHtml";
import useProfile, { useProfileCamber } from "../hooks/useProfile";
import AnimatedInputTechnical from "../../common/drawings/AnimatedInputTechnical";
import Formula from "../../common/Formula";
import HoverableFormulaColor from "../../common/HoverableFormulaColor";

interface Props {
  scale: number;
}

const ProfileNACAExplanation = ({ scale }: Props) => {
  const [hoverPlane, setHoverPlane] = useState(false);
  const [hoverA, setHoverA] = useState(false);
  const [hoverB, setHoverB] = useState(false);
  const [hoverC, setHoverC] = useState(false);

  const { M, P, T } = useProfileCamber();
  const { yCamber } = useProfile();

  return (
    <mesh position-x={-0.25}>
      <Plane
        args={[1.1, 0.5]}
        position-x={0.5}
        position-y={0.1}
        material-transparent
        material-opacity={0.1}
        onPointerMove={(e) => {}}
        onPointerEnter={(e) => setHoverPlane(true)}
        onPointerLeave={(e) => setHoverPlane(false)}
        onClick={(e) => {}}
      />
      <AnimatedHtml
        position-x={0.5}
        position-y={0.25}
        show={hoverPlane || hoverA || hoverB || hoverC}
        scale={1 / scale}
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
      <mesh scale={1 / scale} position-z={0.02}>
        <AnimatedInputTechnical
          scale={scale}
          distance={-2}
          value={1}
          opacity={hoverA || hoverB || hoverC ? 1 : 0}
        >
          <Formula
            className={`text-xl ${hoverA || hoverB || hoverC || "hidden"}`}
            tex={`1`}
          />
        </AnimatedInputTechnical>
        <AnimatedInputTechnical
          scale={scale}
          distance={0.5}
          value={M}
          valueY={-P}
          opacity={hoverA ? 1 : 0}
          vertical
        >
          <div className={`flex text-xl ${hoverA || "hidden"}`}>
            <Formula className={`${M === 0 && "hidden"}`} tex={`0.0`} />
            <Formula className="text-info" tex={`${M * 100}`} />
          </div>
        </AnimatedInputTechnical>
        <AnimatedInputTechnical
          scale={scale}
          distance={-1}
          value={P}
          valueY={M}
          opacity={hoverB ? 1 : 0}
        >
          <div className={`flex text-xl ${hoverB || "hidden"}`}>
            <Formula className={`${P === 0 && "hidden"}`} tex={`0.`} />
            <Formula className="text-info" tex={`${P * 10}`} />
          </div>
        </AnimatedInputTechnical>
      </mesh>
    </mesh>
  );
};

export default ProfileNACAExplanation;
