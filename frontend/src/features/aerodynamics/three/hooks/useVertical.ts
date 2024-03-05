import { useEffect, useState } from "react";
import { useVerticalStore } from "../../stores/useVertical";
import getLeadingTrailing from "../../utils/getLeadingTrailing";
import { BufferGeometry, SphereGeometry } from "three";
import { usePlaneGeometryStore } from "../../stores/usePlaneGeometry";
import { usePlaneStore } from "../../stores/usePlane";
import fuselages from "../../data/fuselages";
import { getArea, getAspectRatio } from "../../utils/getWingSpecs";
import { Wing } from "../../utils/wing/Wing";

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
    const config = {
      span,
      chord,
      chordTip,
      angle,
      shape,
    };
    const { leadingPoints, trailingPoints } = getLeadingTrailing(
      config,
      true,
      false
    );
    setLeading(leadingPoints);
    setTrailing(trailingPoints);
    setTop([
      leadingPoints[leadingPoints.length - 1],
      trailingPoints[trailingPoints.length - 1],
    ]);

    const wing = new Wing(config, "0009");


    const geom = wing.createWingModel();
    setVertical(geom);
    setGeometry({ vertical: geom });

    set({ area: getArea(config) / 2, aspectRatio: getAspectRatio(config) });
  }, [span, chord, chordTip, angle, shape]);

  return { vertical, leading, trailing, top };
};

export default useVertical;
