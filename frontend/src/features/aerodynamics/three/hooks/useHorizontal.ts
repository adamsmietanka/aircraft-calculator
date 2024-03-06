import { useEffect, useState } from "react";
import { useHorizontalStore } from "../../stores/useHorizontal";
import getLeadingTrailing from "../../utils/getLeadingTrailing";
import { useVerticalStore } from "../../stores/useVertical";
import { usePlaneStore } from "../../stores/usePlane";
import { useWingStore } from "../../stores/useWing";
import {
  getArea,
  getAspectRatio,
  getMAC,
  getMACposition,
} from "../../utils/getWingSpecs";
import { getWingPointsAt } from "../../utils/getWingOutline";
import { usePlaneGeometryStore } from "../../stores/usePlaneGeometry";
import { isMultifuse } from "../../utils/planeConfiguration";
import { Wing } from "../../utils/wing/Wing";

const xA = 0.25;

const getMaxTailY = (shape: number) => {
  if (shape === 2) return 0.8;
  return 1;
};

const useHorizontal = () => {
  const [positionLeadTrail, setPositionLeadTrail] = useState([0, 0]);

  const chord = useHorizontalStore((state) => state.chord);
  const span = useHorizontalStore((state) => state.span);
  const angle = useHorizontalStore((state) => state.angle);
  const chordTip = useHorizontalStore((state) => state.chordTip);
  const shape = useHorizontalStore((state) => state.shape);
  const position = useHorizontalStore((state) => state.position);
  const set = useHorizontalStore((state) => state.set);

  const shapeVertical = useVerticalStore((state) => state.shape);
  const spanVertical = useVerticalStore((state) => state.span);
  const chordVertical = useVerticalStore((state) => state.chord);
  const chordTipVertical = useVerticalStore((state) => state.chordTip);
  const angleVertical = useVerticalStore((state) => state.angle);

  const configuration = usePlaneStore((state) => state.configuration);
  const fuselageDistance = usePlaneStore((state) => state.fuselageDistance);
  const length = usePlaneStore((state) => state.length);
  const wingX = usePlaneStore((state) => state.wingX);
  const verticalToTail = usePlaneStore((state) => state.verticalToTail);

  const wingSpan = useWingStore((state) => state.span);
  const MAC = useWingStore((state) => state.MAC);
  const MACposition = useWingStore((state) => state.MACposition)[0];
  const wingArea = useWingStore((state) => state.area);

  const [stabilizer, setStabilizer] = useState(new Wing({}, "10"));

  const setGeometry = usePlaneGeometryStore((state) => state.set);

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

  useEffect(() => {
    const leadTrail = getWingPointsAt(
      {
        shape: shapeVertical,
        span: spanVertical,
        chord: chordVertical,
        chordTip: chordTipVertical,
        angle: angleVertical,
      },
      ((getMaxTailY(shapeVertical) * spanVertical) / 2) * position
    );
    setPositionLeadTrail(leadTrail);
  }, [shapeVertical, spanVertical, chordVertical, position]);

  useEffect(() => {
    const config = { span, chord, chordTip, angle, shape };
    const { leadingPoints, trailingPoints } = getLeadingTrailing(config);
    setLeading(leadingPoints);
    setTrailing(trailingPoints);
    setTop([
      leadingPoints[leadingPoints.length - 1],
      trailingPoints[trailingPoints.length - 1],
    ]);

    const wing = new Wing(config, "0009");
    wing.FLAP_CHORD_START = 0.6;
    const geom = wing.createModel();
    wing.createFlap();

    setGeometry({ horizontal: geom });

    setStabilizer(wing);

    const area = getArea(config);
    const aspectRatio = getAspectRatio(config);
    const MAC_H = getMAC(config);
    const MACpositionH = getMACposition(config)[0];
    const stabilizerX = length - wingX - verticalToTail;
    const stabilizerXAero = stabilizerX + MACpositionH + MAC_H * 0.25;
    const lH = stabilizerXAero - MACposition - MAC * xA;
    const kH = ((area * lH) / (wingArea * MAC)) * (0.85 + 0.13 * position);

    set({ area, kH, aspectRatio, lever: lH });
  }, [span, chord, chordTip, angle, shape, chordVertical, position]);

  useEffect(() => {
    if (isMultifuse(configuration)) {
      set({ span: fuselageDistance * 1.5 });
    } else {
      set({ span: wingSpan / 3 });
    }
  }, [configuration, fuselageDistance]);

  return { leading, trailing, top, positionLeadTrail, stabilizer };
};

export default useHorizontal;
