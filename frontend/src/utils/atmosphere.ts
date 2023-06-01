export const density = (height: number) => {
    if (height < 11000) {
      return 1.255 * (1 - height / 44330) ** 4.256;
    } else {
      return 0.3639 * Math.exp(-(height - 11000) / 6340);
    }
  };