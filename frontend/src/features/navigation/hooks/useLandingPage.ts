import { useEffect, useState } from "react";
import { BufferGeometry } from "three";
import { useProfileStore } from "../../aerodynamics/stores/useProfile";
import getProfilePoints from "../../aerodynamics/utils/getProfilePoints";
import createWingModel from "../../aerodynamics/three/utils/createWingModel";

const useLandingPage = () => {
  const [geom1, setGeom1] = useState<BufferGeometry>(null!);
  const [geom2, setGeom2] = useState<BufferGeometry>(null!);
  const [geom3, setGeom3] = useState<BufferGeometry>(null!);
  const [elliptic, setElliptic] = useState<BufferGeometry>(null!);

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
    setGeom3(
      createWingModel(
        {
          span: 4,
          chord: 1.25,
          chordTip: 0.65,
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
          shape: 3,
        },
        symmetric,
        false
      )
    );
  }, []);

  return { geom1, geom2, geom3, elliptic };
};

export default useLandingPage;
