import useWingScale from "../../hooks/useWingScale";
import {
  CANVAS_WIDTH,
  PROFILE_POSITION,
  VECTOR_SIZE,
} from "../../../common/three/config";
import VectorNew from "../../../common/three/VectorNew";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import { SpringValue, animated, config, useSpring } from "@react-spring/three";

interface Props {
  opacity: SpringValue<number>;
}

const VECTOR_SPREAD = 0.01;

const IntroductionVectors = ({ opacity }: Props) => {
  const vectorBottom = useHoverProfileStore((state) => state.vectorBottom);
  const vectorTop = useHoverProfileStore((state) => state.vectorTop);
  const vectorsSide = useHoverProfileStore((state) => state.vectorsSide);
  const vectorsNet = useHoverProfileStore((state) => state.vectorsNet);

  const { scaleProfile } = useWingScale();

  const down = 0.9;
  const up = 0.2;
  const left = 0.15;
  const right = 0.1;

  const [spring] = useSpring(
    () => ({
      verticalX: vectorsNet ? 0.01 : 0,
      vectorsNet: +vectorsNet,
      config: config.slow,
    }),
    [vectorsNet]
  );

  return (
    <mesh
      position-x={(PROFILE_POSITION * CANVAS_WIDTH) / 2}
      scale={scaleProfile}
    >
      <mesh position-x={0.25} rotation-z={(-5 * Math.PI) / 180}>
        <mesh position-x={-0.25}>
          {/* vertical */}
          <animated.mesh
            position-x={spring.vectorsNet.to(
              (vectorsNet) => 0.5 - vectorsNet * VECTOR_SPREAD
            )}
            position-y={spring.vectorsNet.to(
              (vectorsNet) => (vectorsNet - 1) * 0.045
            )}
            scale={1 / scaleProfile}
          >
            <animated.mesh
              position-y={spring.vectorsNet.to(
                (vectorsNet) => (vectorsNet - 1) * down * VECTOR_SIZE
              )}
            >
              <VectorNew
                y={down}
                show={vectorBottom}
                opacity={opacity}
                color="primary"
              />
            </animated.mesh>
          </animated.mesh>
          <animated.mesh
            position-x={spring.vectorsNet.to(
              (vectorsNet) => 0.5 + vectorsNet * VECTOR_SPREAD
            )}
            position-y={spring.vectorsNet.to(
              (vectorsNet) => (vectorsNet - 1) * -0.045
            )}
            scale={1 / scaleProfile}
          >
            <animated.mesh
              position-y={spring.vectorsNet.to(
                (vectorsNet) =>
                  (vectorsNet - 1) * -up * VECTOR_SIZE +
                  vectorsNet * down * VECTOR_SIZE
              )}
            >
              <VectorNew
                y={-up}
                show={vectorTop}
                opacity={opacity}
                color="secondary"
              />
            </animated.mesh>
          </animated.mesh>
          {/* horizontal */}
          <animated.mesh
            position-x={spring.vectorsNet.to(
              (vectorsNet) => 0.5 + (vectorsNet - 1) * 0.5
            )}
            position-y={spring.vectorsNet.to(
              (vectorsNet) => (vectorsNet * VECTOR_SPREAD) / 2
            )}
            scale={1 / scaleProfile}
          >
            <animated.mesh
              position-y={spring.vectorsNet.to(
                (vectorsNet) => vectorsNet * (down - up) * VECTOR_SIZE
              )}
              position-x={spring.vectorsNet.to(
                (vectorsNet) => (vectorsNet - 1) * left * VECTOR_SIZE
              )}
            >
              <VectorNew
                x={left}
                show={vectorsSide}
                opacity={opacity}
                color="secondary"
              />
            </animated.mesh>
          </animated.mesh>
          <animated.mesh
            position-x={spring.vectorsNet.to(
              (vectorsNet) => 0.5 - (vectorsNet - 1) * 0.5
            )}
            position-y={spring.vectorsNet.to(
              (vectorsNet) => (-vectorsNet * VECTOR_SPREAD) / 2
            )}
            scale={1 / scaleProfile}
          >
            <animated.mesh
              position-y={spring.vectorsNet.to(
                (vectorsNet) =>
                  vectorsNet * (down - up) * VECTOR_SIZE -
                  vectorsNet * VECTOR_SPREAD
              )}
              position-x={spring.vectorsNet.to(
                (vectorsNet) =>
                  (vectorsNet - 1) * -right * VECTOR_SIZE +
                  vectorsNet * left * VECTOR_SIZE
              )}
            >
              <VectorNew
                x={-right}
                show={vectorsSide}
                opacity={opacity}
                color="primary"
              />
            </animated.mesh>
          </animated.mesh>
          {/* end */}
        </mesh>
      </mesh>
    </mesh>
  );
};

export default IntroductionVectors;
