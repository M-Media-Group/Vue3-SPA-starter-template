import { hsl2rgb } from "@/helpers/colors";

export const getCssVarForStripe = (color: string) => {
  const computedColor = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${color}`)
    .trim()
    .replace("deg", "");

  // If the computedColor starts with hsl, convert it to rgb
  if (computedColor.startsWith("hsl")) {
    const hsl = computedColor.replace("hsl(", "").replace(")", "").split(",");
    const rgb = hsl2rgb(
      parseInt(hsl[0]),
      parseInt(hsl[1]) / 100,
      parseInt(hsl[2]) / 100
    );
    const rgbIn255Scale = rgb.map((c) => Math.round(c * 255));
    return `rgb(${rgbIn255Scale.join(",")})`;
  }

  return computedColor;
};
