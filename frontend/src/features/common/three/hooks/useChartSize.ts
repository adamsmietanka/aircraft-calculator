import { useThree } from "@react-three/fiber";

const useChartSize = () => {
  const { viewport } = useThree();
  return {
    width: 0.95 * viewport.width - 3,
    height: 0.8 * viewport.height -1,
  };
};

export default useChartSize;
