import { useEffect, useState } from "react";
import { BufferGeometry } from "three";
import { useProfileStore } from "../../aerodynamics/stores/useProfile";
import getProfilePoints from "../../aerodynamics/utils/getProfilePoints";
import createWingModel from "../../aerodynamics/three/utils/createWingModel";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const useLandingPage = () => {
  const [fuse1, setFuse1] = useState<BufferGeometry>(null!);
  const [fuse2, setFuse2] = useState<BufferGeometry>(null!);

  const [geom1, setGeom1] = useState<BufferGeometry>(null!);
  const [geom2, setGeom2] = useState<BufferGeometry>(null!);
  const [vertical, setVertical] = useState<BufferGeometry>(null!);
  const [elliptic, setElliptic] = useState<BufferGeometry>(null!);
  const [tail, setTail] = useState<BufferGeometry>(null!);
  const [tailSquare, setTailSquare] = useState<BufferGeometry>(null!);

  const { nodes } = useLoader(GLTFLoader, "/models/fuse.glb");

  const profilePoints = useProfileStore((state) => state.profile);

  useEffect(() => {
    const otherProfilePoints = getProfilePoints("4415");
    const symmetric = getProfilePoints("0006");

    setGeom1(
      createWingModel(
        {
          span: 12,
          chord: 2,
          chordTip: 1.2,
          angle: 10,
          shape: 1,
        },
        profilePoints
      )
    );
    setGeom2(
      createWingModel(
        {
          span: 12,
          chord: 2,
          chordTip: 1.2,
          angle: 10,
          shape: 0,
        },
        otherProfilePoints
      )
    );
    setVertical(
      createWingModel(
        {
          span: 3,
          chord: 1.5,
          chordTip: 0.9,
          angle: 20,
          shape: 1,
        },
        symmetric,
        false
      )
    );
    setElliptic(
      createWingModel(
        {
          span: 3,
          chord: 1.25,
          chordTip: 0.65,
          angle: 20,
          shape: 2,
        },
        symmetric,
        false
      )
    );
    setTail(
      createWingModel(
        {
          span: 4,
          chord: 1.25,
          chordTip: 0.65,
          angle: 5,
          shape: 1,
        },
        symmetric
      )
    );
    setTailSquare(
      createWingModel(
        {
          span: 3.5,
          chord: 0.7,
          chordTip: 0.65,
          angle: 5,
          shape: 1,
        },
        symmetric
      )
    );
    setFuse1(nodes[2303]?.geometry);
    setFuse2(nodes[2302]?.geometry);
  }, []);

  return { geom1, geom2, vertical, elliptic, tail, tailSquare, fuse1, fuse2 };
};

export default useLandingPage;
