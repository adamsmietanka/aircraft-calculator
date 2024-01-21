import { useEffect, useState } from "react";
import { useHorizontalStore } from "../../stores/useHorizontal";
import getLeadingTrailing from "../../utils/getLeadingTrailing";
import { BufferGeometry, SphereGeometry } from "three";
import getProfilePoints from "../../utils/getProfilePoints";
import createWingModel from "../utils/createWingModel";
import { useVerticalStore } from "../../stores/useVertical";
import { usePlaneStore } from "../../stores/usePlane";
import { useWingStore } from "../../stores/useWing";
import {
  getArea,
  getAspectRatio,
  getMAC,
  getMACposition,
} from "../../utils/getWingSpecs";

const xG = 0.28;
const xA = 0.25;
const cM = -0.05;
const Vfrac = 0.85;

const useHorizontal = () => {
  const chordV = useVerticalStore((state) => state.chord);
  const chord = useHorizontalStore((state) => state.chord);
  const span = useHorizontalStore((state) => state.span);
  const angle = useHorizontalStore((state) => state.angle);
  const chordTip = useHorizontalStore((state) => state.chordTip);
  const shape = useHorizontalStore((state) => state.shape);
  const set = useHorizontalStore((state) => state.set);

  const length = usePlaneStore((state) => state.length);
  const wingX = usePlaneStore((state) => state.wingX);
  const verticalToTail = usePlaneStore((state) => state.verticalToTail);

  const MAC = useWingStore((state) => state.MAC);
  const MACposition = useWingStore((state) => state.MACposition)[0];
  const wingArea = useWingStore((state) => state.area);

  const [horizontal, setHorizontal] = useState<BufferGeometry>(
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
  const [symmetric] = useState(getProfilePoints("0009"));

  useEffect(() => {
    const config = { span, chord, chordTip, angle, shape };
    set({ chord: chordV });
    const { leadingPoints, trailingPoints } = getLeadingTrailing(config);
    setLeading(leadingPoints);
    setTrailing(trailingPoints);
    setTop([
      leadingPoints[leadingPoints.length - 1],
      trailingPoints[trailingPoints.length - 1],
    ]);

    setHorizontal(createWingModel(config, symmetric));

    const area = getArea(config);
    const aspectRatio = getAspectRatio(config);
    const MAC_H = getMAC(config);
    const MACpositionH = getMACposition(config)[0];
    const stabilizerX = length - wingX - verticalToTail;
    const stabilizerXAero = stabilizerX + MACpositionH + MAC_H * 0.25;
    const lH = stabilizerXAero - MACposition - MAC * xA;
    const kH = ((area * lH) / (wingArea * MAC)) * Vfrac;
    // console.log(stabilizerXAero, lH, kH);

    set({ area, kH, aspectRatio });
  }, [span, chord, chordTip, angle, shape, chordV]);

  return { horizontal, leading, trailing, top };
};

export default useHorizontal;
