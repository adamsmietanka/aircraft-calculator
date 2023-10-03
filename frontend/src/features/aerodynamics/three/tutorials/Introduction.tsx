import { SpringValue, animated, useSpring } from "@react-spring/three";
import { Text } from "@react-three/drei";
import { useLocation, useNavigate } from "react-router-dom";
import { useCSSColors } from "../../../common/three/config";
import { useHoverProfileStore } from "../../stores/useHoverProfile";
import { useWingStore } from "../../stores/useWing";
import { useRef } from "react";
import { useProfileChartsStore } from "../../hooks/useProfileCharts";

interface Props {
  opacity: SpringValue<number>;
}

const SUB_SIZE = 0.35;

const Introduction = ({ opacity }: Props) => {
  const profile = useWingStore((state) => state.profile);
  const setProfile = useWingStore((state) => state.setProfile);
  const set = useHoverProfileStore((state) => state.set);
  const setChart = useProfileChartsStore((state) => state.set);
  const chart = useProfileChartsStore();

  const savedProfile = useRef("2412");
  const savedAngle = useRef(0);

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

  const setAngles = async (next: any, angles: number[]) => {
    for (const a of angles) {
      setChart({ xHover: a });
      await next({ delay: 100 });
    }
    await next({ delay: 1000 });
  };

  const [introductionSpring, introductionSpringApi] = useSpring(
    () => ({
      from: {
        basics: false,
        drag: false,
        angled: false,
        forces: false,
        forces2: false,
        split: false,
        outline: false,
        chord: false,
        camber: false,
        hoverA: false,
        hoverB: false,
        hoverC: false,
      },
      to: async (next) => {
        if (location.pathname === "/aerodynamics/introduction") {
          savedProfile.current = profile;
          savedAngle.current = chart.xHover;
          setProfile("0009");

          await next({ delay: 2000 });
          set({ splitVectors: false });
          setChart({ xHover: 0 });
          await showSubtitle(next, "basics");
          setChart({ hover: true });
          await showSubtitle(next, "drag");

          await setAngles(next, [0.1, 0.5, 1, 2, 3, 4, 5, 6, 7, 8]);

          await showSubtitle(next, "angled");
          await showSubtitle(next, "forces");
          await showSubtitle(next, "forces2");
          set({ splitVectors: true });
          await showSubtitle(next, "split");
          setChart({ hover: false });
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
          await next({ delay: 500 });
          setProfile(savedProfile.current);
          setChart({ xHover: savedAngle.current });

          navigate("/aerodynamics/profile");
        } else {
          await next({
            basics: false,
            drag: false,
            angled: false,
            forces: false,
            forces2: false,
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
          setChart({ hover: false, xHover: savedAngle.current });
          setProfile(savedProfile.current);
        }
      },
    }),
    [location.pathname]
  );
  return (
    <mesh position-y={-1.5}>
      <AnimatedText
        fontSize={SUB_SIZE}
        visible={introductionSpring.basics}
        color={colors["primary"]}
      >
        Let's start with a simple rectangular plate
      </AnimatedText>
      <AnimatedText
        fontSize={SUB_SIZE}
        visible={introductionSpring.drag}
        color={colors["primary"]}
      >
        When it is not angled the force acting on the plate is only horizontal
      </AnimatedText>
      <AnimatedText
        fontSize={SUB_SIZE}
        visible={introductionSpring.angled}
        color={colors["primary"]}
      >
        In order to deflect the air downwards
      </AnimatedText>
      <AnimatedText
        fontSize={SUB_SIZE}
        visible={introductionSpring.forces}
        color={colors["primary"]}
      >
        the plate must exert a force on the flow
      </AnimatedText>
      <AnimatedText
        fontSize={SUB_SIZE}
        visible={introductionSpring.forces2}
        color={colors["primary"]}
      >
        By Newton's 3rd Law we should have a force acting on the plate
      </AnimatedText>
      <AnimatedText
        fontSize={SUB_SIZE}
        visible={introductionSpring.split}
        color={colors["primary"]}
      >
        We can split it into vertical and horizontal components
      </AnimatedText>
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
