import { Mesh } from "../../data/cp";

export const generate_verts = (mesh: Mesh) => {
  const results: number[] = [];

  const advanceRatios = mesh.J;
  const values = mesh.Z;

  values.forEach((heights, i) => {
    heights.forEach((height, j) => {
      const angle = mesh.angles[j];
      results.push(angle, height, advanceRatios[i]);
    });
  });
  console.log(results);
  return new Float32Array(results);
};

export const generate_verts_rev = (mesh: Mesh) => {
  const results: number[] = [];

  // Reversing the order of the advance ratios to make the mesh triangles face the other way
  const advanceRatios = [...mesh.J].reverse();
  const values = [...mesh.Z].reverse();

  values.forEach((heights, i) => {
    heights.forEach((height, j) => {
      const angle = mesh.angles[j];
      results.push(angle, height, advanceRatios[i]);
    });
  });
  console.log(results);
  return new Float32Array(results);
};

export const rotate_mesh = (mesh: Mesh) => {
  /**
   * The meshes created by Python are first looped through angles and then by advance ratios
   * For Three.js we must reverse this loop order
   * @param {Mesh} mesh - first row is an array of advance ratios and the rest are values
   */
  return {
    ...mesh,
    Z: [...mesh.Z[0].map((_, i) => mesh.Z.map((row) => row[i]))],
  };
};
