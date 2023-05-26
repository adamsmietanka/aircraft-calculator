import { Mesh } from "../../data/cp";

export const generate_verts = (mesh: number[][]) => {
  const results: number[] = [];

  const advanceRatios = mesh[0];
  const values = mesh.slice(1);

  values.forEach((heights, i) => {
    heights.forEach((height, j) => {
      const angle = 10 + j;
      results.push(angle, height, advanceRatios[i]);
    });
  });
  return new Float32Array(results);
};

export const generate_verts_rev = (mesh: Mesh) => {
  const results: number[] = [];

  // Reversing the order of the advance ratios to make the mesh triangles face the other way
  const advanceRatios = [...mesh.J].reverse();
  const values = [...mesh.cp].reverse();

  values.forEach((heights, i) => {
    heights.forEach((height, j) => {
      const angle = 10 + j;
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
    cp: [...mesh.cp[0].map((_, i) => mesh.cp.map((row) => row[i]))],
  };
};
