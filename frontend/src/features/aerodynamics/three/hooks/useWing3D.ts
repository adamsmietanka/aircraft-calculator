import { useCallback, useEffect, useState } from "react";
import { useWingStore } from "../../stores/useWing";
import { getStep } from "../../../common/three/hooks/useAxes";
import debounce from "../../../../utils/debounce";

const getXTip = (angle: number, span: number) =>
  (Math.tan((angle * Math.PI) / 180) * span) / 2;

const useWing3D = () => {
  const wing = useWingStore();

  const [active, setActive] = useState<THREE.Object3D>(null!);

  useEffect(() => {
    if (wing.shape !== 1 && active?.userData.number === 2) {
      setActive(null!);
    }
  }, [wing.shape]);

  const update = useCallback(
    debounce(
      (
        userData: { isTip: boolean; isTrailing: boolean; isFuselage: boolean },
        x: number,
        y: number
      ) => {
        if (userData.isTip) {
          useWingStore.setState({ span: parseFloat((y * 2).toPrecision(4)) });

          if (userData.isTrailing) {
            const angle = useWingStore.getState().angle;
            const span = useWingStore.getState().span;
            const xTip = getXTip(angle, span);

            useWingStore.setState({
              chordTip: parseFloat((x - xTip).toPrecision(4)),
            });
          }
        } else if (userData.isFuselage) {
          useWingStore.setState({ chord: parseFloat(x.toPrecision(4)) });
        }
      },
      33
    ),
    []
  );

  const onTransform = (e: THREE.Event | undefined) => {
    if (e && e.target && e.target.object) {
      const { x, y } = e.target.object.position;
      update(e.target.object.userData, x, y);
    }
  };

  return {
    onTransform,
    active,
    setActive,
    step: getStep(wing.span / 1.5),
  };
};

export default useWing3D;
