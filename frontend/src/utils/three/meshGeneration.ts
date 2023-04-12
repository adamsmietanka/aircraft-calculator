export const generate_verts = (mesh: number[][]) => {
  const results: number[] = [];

  const advanceRatios = mesh[0];
  const values = mesh.slice(1);

  values.forEach((heights, i) => {
    heights.forEach((height, j) => {
      const angle = 10 + j * 0.5;
      results.push(angle, height, advanceRatios[i]);
    });
  });
  return new Float32Array(results);
};

export const generate_verts_rev = (mesh: number[][]) => {
  const results: number[] = [];

  // Reversing the order of the advance ratios to make the mesh triangles face the other way
  const advanceRatios = mesh.slice()[0].reverse();
  const values = mesh.slice(1).reverse();

  values.forEach((heights, i) => {
    heights.forEach((height, j) => {
      const angle = 10 + j * 0.5;
      results.push(angle, height, advanceRatios[i]);
    });
  });
  return new Float32Array(results);
};

export const rotate_mesh = (mesh: number[][]) => {
  /**
   * The meshes created by Python are first looped through angles and then by advance ratios
   * For Three.js we must reverse this loop order
   * @param {number[][]} mesh - first row is an array of advance ratios and the rest are values
   */
  const values = mesh.slice(1);
  return [mesh[0], ...values[0].map((_, i) => values.map((row) => row[i]))];
};
