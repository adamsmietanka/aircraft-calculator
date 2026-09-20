export const checkVisible = (mesh: THREE.Object3D): boolean => {
  if (mesh.userData.hide) return false;
  if (mesh.parent) {
    return checkVisible(mesh.parent);
  }
  return true;
};
