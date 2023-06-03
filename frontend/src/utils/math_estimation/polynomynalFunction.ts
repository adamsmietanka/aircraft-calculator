const polynomynalFunction = (x: number, params: number[]) => {
  const polynomynal = params.reduce(
    (accumulator, currentValue, currentIndex) =>
      accumulator + Math.pow(x, params.length - currentIndex-1) * currentValue,
    0
  );

  return polynomynal;
};

export default polynomynalFunction;
