import { SpringValue, animated, useSpring } from "@react-spring/three";
import { Text } from "@react-three/drei";
import { useLocation, useNavigate } from "react-router-dom";
import { useCSSColors } from "../../../common/three/config";
import { useIntroductionStore } from "../../stores/useIntroduction";

interface Props {
  opacity: SpringValue<number>;
}

const SUB_SIZE = 0.35;

const Introduction = ({ opacity }: Props) => {
  const setProfile = useIntroductionStore((state) => state.setProfile);
  const set = useIntroductionStore((state) => state.set);

  const location = useLocation();
  const navigate = useNavigate();
  const AnimatedText = animated(Text);
  const { colors } = useCSSColors();

  const showSubtitle = async (next: any, name: string, duration = 2500) => {
    await next({ [name]: true });
    await next({ delay: duration, [name]: false });
    await next({ delay: 2000 });
  };

  const showDimension = async (next: any, name: string, profiles: string[]) => {
    set({ [name]: true });
    await next({ [name]: true });
    await next({ delay: 1500 });
    for (const p of profiles) {
      await next({ delay: 500 });
      setProfile(p);
    }
    await next({ delay: 1000, [name]: false });
    set({ [name]: false });
    await next({ delay: 1500 });
  };

  const [introductionSpring, introductionSpringApi] = useSpring(
    () => ({
      from: {
        outline: false,
        chord: false,
        camber: false,
        hoverA: false,
        hoverB: false,
        hoverC: false,
      },
      to: async (next) => {
        if (location.pathname === "/aerodynamics/introduction") {
          await next({ delay: 2000 });
          await showSubtitle(next, "outline");
          await showSubtitle(next, "chord");
          await showSubtitle(next, "camber");

          set({ hoverPlane: true });
          await showDimension(next, "hoverA", [
            "1412",
            "2412",
            "3412",
            "4412",
            "5412",
            "6412",
            "4412",
          ]);
          await showDimension(next, "hoverB", [
            "4312",
            "4412",
            "4512",
            "4612",
            "4512",
            "4412",
          ]);
          await showDimension(next, "hoverC", [
            "4415",
            "4418",
            "4421",
            "4424",
            "4415",
          ]);
          set({ hoverPlane: false });

          navigate("/aerodynamics/profile");
        } else {
          await next({
            outline: false,
            chord: false,
            camber: false,
            hoverA: false,
            hoverB: false,
            hoverC: false,
          });
          set({
            hoverA: false,
            hoverB: false,
            hoverC: false,
            hoverPlane: false,
          });
        }
      },
    }),
    [location.pathname]
  );
  return (
    <mesh position-y={-1.5}>
      <AnimatedText
        fontSize={SUB_SIZE}
        visible={introductionSpring.outline}
        color={colors["primary"]}
      >
        This is an aerodynamic profile
      </AnimatedText>
      <AnimatedText
        fontSize={SUB_SIZE}
        visible={introductionSpring.chord}
        color={colors["grid"]}
        fillOpacity={0.2}
      >
        chord line
      </AnimatedText>
      <AnimatedText
        fontSize={SUB_SIZE}
        visible={introductionSpring.camber}
        color={colors["secondary"]}
        fillOpacity={0.6}
      >
        camber line
      </AnimatedText>
      <mesh position-y={-1.5}>
        <AnimatedText
          fontSize={SUB_SIZE}
          visible={introductionSpring.hoverA}
          color={colors["error"]}
        >
          max camber
        </AnimatedText>
        <AnimatedText
          fontSize={SUB_SIZE}
          visible={introductionSpring.hoverB}
          color={colors["error"]}
        >
          position of max camber
        </AnimatedText>
        <AnimatedText
          fontSize={SUB_SIZE}
          visible={introductionSpring.hoverC}
          color={colors["error"]}
        >
          max thickness
        </AnimatedText>
      </mesh>
    </mesh>
  );
};

export default Introduction;
