import { useFrame } from "@react-three/fiber";

const useFrameLimited = (callback: () => void) => {
  let timer = 0;

  useFrame((state, delta) => {
    timer += delta;
    if (timer > 5) {
      timer = 0;
      callback();
    }
  });
};
export default useFrameLimited;
