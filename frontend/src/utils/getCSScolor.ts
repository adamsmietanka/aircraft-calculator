import Color from "colorjs.io";

export const getCSScolor = (variable: string) => {
  const style = getComputedStyle(document.body);
  return style.getPropertyValue(`--${variable}`).replaceAll(" ", ",");
};

export const HSLToRGB = (h: number, s: number, l: number) => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
};

export const getRGBColorFromCSS = (name: string) => {
  const color = getCSScolor(name);
  const [h, s, l] = color
    .replaceAll("%", "")
    .split(",")
    .map((v) => parseFloat(v));
  return HSLToRGB(h, s, l);
};

export const getHSLColorFromCSS = (name: string) => {
  const colorVar = getCSScolor(name);
  const color = new Color(`oklch(${colorVar})`).to("hsl");
  return `hsl(${color.coords[0]},${color.coords[1]}%,${color.coords[2]}%)`;
};
