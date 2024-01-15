import { useEffect, useState } from "react";
import { useVerticalStore } from "../../stores/useVertical";
import getLeadingTrailing from "../../utils/getLeadingTrailing";
import { BufferGeometry, SphereGeometry } from "three";
import getProfilePoints from "../../utils/getProfilePoints";
import createWingModel from "../utils/createWingModel";

const useVertical = () => {
  const wing = useVerticalStore();

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

  useEffect(() => {
    const { leadingPoints, trailingPoints } = getLeadingTrailing(
      {
        span: wing.span,
        chord: wing.chord,
        chordTip: wing.chordTip,
        angle: wing.angle,
        shape: wing.shape,
      },
      true,
      false
    );
    setLeading(leadingPoints);
    setTrailing(trailingPoints);

    const symmetric = getProfilePoints("0009");
    setVertical(
      createWingModel(
        {
          span: wing.span,
          chord: wing.chord,
          chordTip: wing.chordTip,
          angle: wing.angle,
          shape: wing.shape,
        },
        symmetric,
        false
      )
    );
  }, [wing]);
  return { vertical, leading, trailing };
};

export default useVertical;
