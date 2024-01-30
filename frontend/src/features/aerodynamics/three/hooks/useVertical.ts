import { useEffect, useState } from "react";
import { useVerticalStore } from "../../stores/useVertical";
import getLeadingTrailing from "../../utils/getLeadingTrailing";
import { BufferGeometry, SphereGeometry } from "three";
import getProfilePoints from "../../utils/getProfilePoints";
import createWingModel from "../utils/createWingModel";
import { usePlaneGeometryStore } from "../../stores/usePlaneGeometry";
import { usePlaneStore } from "../../stores/usePlane";
import fuselages from "../../data/fuselages";

const useVertical = () => {
  const chord = useVerticalStore((state) => state.chord);
  const span = useVerticalStore((state) => state.span);
  const angle = useVerticalStore((state) => state.angle);
  const chordTip = useVerticalStore((state) => state.chordTip);
  const shape = useVerticalStore((state) => state.shape);
  const set = useVerticalStore((state) => state.set);
  const setGeometry = usePlaneGeometryStore((state) => state.set);

  const [vertical, setVertical] = useState<BufferGeometry>(
    new SphereGeometry()
  );

  const [leading, setLeading] = useState([
    [0, 0, 0],
    [1, 1, 1],
  ]);
  const [trailing, setTrailing] = useState([
    [0, 0, 0],
    [1, 1, 1],
  ]);
  const [top, setTop] = useState([
    [0, 0, 0],
    [1, 1, 1],
  ]);

  const fuselage = usePlaneStore((state) => state.fuselage);
  const configuration = usePlaneStore((state) => state.configuration);
  const length = usePlaneStore((state) => state.length);
  const wingX = usePlaneStore((state) => state.wingX);
  const verticalToTail = usePlaneStore((state) => state.verticalToTail);
  const setPlane = usePlaneStore((state) => state.set);

  useEffect(() => {
    setPlane({
      verticalX: length - wingX - verticalToTail,
      verticalY: fuselages[fuselage].verticalY * length,
    });
  }, [configuration, fuselage, shape, wingX, length, verticalToTail]);

  useEffect(() => {
    const { leadingPoints, trailingPoints } = getLeadingTrailing(
      {
        span,
        chord,
        chordTip,
        angle,
        shape,
      },
      true,
      false
    );
    setLeading(leadingPoints);
    setTrailing(trailingPoints);
    setTop([
      leadingPoints[leadingPoints.length - 1],
      trailingPoints[trailingPoints.length - 1],
    ]);

    const symmetric = getProfilePoints("0009");
    const geom = createWingModel(
      {
        span,
        chord,
        chordTip,
        angle,
        shape,
      },
      symmetric,
      false
    );
    setVertical(geom);
    setGeometry({ vertical: geom });

    const getArea = () => {
      if (shape === 0) return chord * span;
      if (shape === 1) return ((chord + chordTip) * span) / 2;
      return (Math.PI * chord * span) / 4;
    };

    set({ area: getArea() });
  }, [span, chord, chordTip, angle, shape]);

  return { vertical, leading, trailing, top };
};

export default useVertical;
