import { useThree } from "@react-three/fiber";

const useChartSize = () => {
  const { viewport } = useThree();
  return {
    width: viewport.width * 0.8,
    height: viewport.height * 0.8,
  };
};

export default useChartSize;
