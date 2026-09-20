import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh } from "three";

/** Every node in fuse.glb is a mesh, but GLTF types `nodes` as bare Object3D,
 *  which has no `geometry`. */
const useFuseNodes = () => {
  const { nodes } = useLoader(GLTFLoader, "/models/fuse.glb");
  return nodes as { [name: string]: Mesh };
};

export default useFuseNodes;
