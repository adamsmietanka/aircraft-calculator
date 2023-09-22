export const checkVisible = (
  mesh: THREE.Mesh | THREE.Object3D<THREE.Event>
): boolean => {
  if (!!mesh.userData.hide) return false;
  if (mesh.parent) {
    return checkVisible(mesh.parent);
  }
  return true;
};
