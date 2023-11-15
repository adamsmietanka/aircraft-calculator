import useWingScale from "../../hooks/useWingScale";
import {
  CANVAS_WIDTH,
  PROFILE_POSITION,
  VECTOR_SIZE,
} from "../../../common/three/config";
import VectorNew from "../../../common/three/VectorNew";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import { SpringValue, animated, config, useSpring } from "@react-spring/three";
import MomentNew from "../../../common/three/MomentNew";
import HoverableFormulaSimple from "../../../common/HoverableFormulaSimple";
import { useEffect } from "react";

interface Props {
  opacity: SpringValue<number>;
}

const VECTOR_SPREAD = 0.01;

const IntroductionVectors = ({ opacity }: Props) => {
  const vectorBottom = useHoverProfileStore((state) => state.vectorBottom);
  const vectorTop = useHoverProfileStore((state) => state.vectorTop);
  const vectorsSide = useHoverProfileStore((state) => state.vectorsSide);
  const showSum = useHoverProfileStore((state) => state.vectorsNet);
  const moment = useHoverProfileStore((state) => state.moment);

  const { scaleProfile } = useWingScale();

  const down = 0.9;
  const up = 0.2;
  const left = 0.15;
  const right = 0.1;

  const [spring, api] = useSpring(
    () => ({
      config: config.slow,
      vertX: 0,
      vertY: 0,
      downY: 0,
      upY: 0,
      horX: 0,
      horY: 0,
      leftRightY: 0,
      leftX: 0,
      rightX: 0,
    }),
    []
  );

  useEffect(() => {
    if (!showSum) {
      // default positions
      api.start({
        vertX: 0,
        vertY: -0.03,
        downY: -down * VECTOR_SIZE,
        upY: up * VECTOR_SIZE,
        horX: -0.5,
        horY: 0,
        leftRightY: 0,
        leftX: -left * VECTOR_SIZE,
        rightX: right * VECTOR_SIZE,
      });
    } else {
      // showing sums
      api.start({
        vertX: -VECTOR_SPREAD,
        vertY: 0,
        downY: 0,
        upY: down * VECTOR_SIZE,
        horX: 0,
        horY: VECTOR_SPREAD / 2,
        leftRightY: (down - up) * VECTOR_SIZE,
        leftX: 0,
        rightX: left * VECTOR_SIZE,
      });
    }
  }, [showSum]);

  return (
    <mesh
      position-x={(PROFILE_POSITION * CANVAS_WIDTH) / 2}
      scale={scaleProfile}
    >
      <mesh position-x={0.25} rotation-z={(-5 * Math.PI) / 180}>
        <mesh scale={1 / scaleProfile} position-z={0.1}>
          <MomentNew show={moment} opacity={opacity} color="secondary">
            <HoverableFormulaSimple
              name="Pitching Moment"
              tex="M"
              texHover="M"
            />
          </MomentNew>
        </mesh>
        <mesh position-x={-0.25}>
          <mesh position-x={0.5}>
            {/* down */}
            <animated.mesh
              position-x={spring.vertX}
              position-y={spring.vertY}
              scale={1 / scaleProfile}
            >
              <animated.mesh position-y={spring.downY}>
                <VectorNew
                  y={down}
                  show={vectorBottom}
                  opacity={opacity}
                  color="primary"
                />
              </animated.mesh>
            </animated.mesh>
            {/* up */}
            <animated.mesh
              position-x={spring.vertX.to((x) => -x)}
              position-y={spring.vertY.to((y) => -y)}
              scale={1 / scaleProfile}
            >
              <animated.mesh position-y={spring.upY}>
                <VectorNew
                  y={-up}
                  show={vectorTop}
                  opacity={opacity}
                  color="secondary"
                />
              </animated.mesh>
            </animated.mesh>
            {/* left */}
            <animated.mesh
              position-x={spring.horX}
              position-y={spring.horY}
              scale={1 / scaleProfile}
            >
              <animated.mesh
                position-y={spring.leftRightY}
                position-x={spring.leftX}
              >
                <VectorNew
                  x={left}
                  show={vectorsSide}
                  opacity={opacity}
                  color="secondary"
                />
              </animated.mesh>
            </animated.mesh>
            {/* right */}
            <animated.mesh
              position-x={spring.horX.to((x) => -x)}
              position-y={spring.horY.to((y) => -y)}
              scale={1 / scaleProfile}
            >
              <animated.mesh
                position-y={spring.leftRightY}
                position-x={spring.rightX}
              >
                <VectorNew
                  x={-right}
                  show={vectorsSide}
                  opacity={opacity}
                  color="primary"
                />
              </animated.mesh>
            </animated.mesh>
          </mesh>
          {/* end */}
        </mesh>
      </mesh>
    </mesh>
  );
};

export default IntroductionVectors;
