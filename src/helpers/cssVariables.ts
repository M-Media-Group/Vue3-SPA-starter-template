import { hsl2rgb } from "@/helpers/colors";

/** Get the value of a CSS variable. Apply some extra logic useful for Stripe, like coverting > 100% to pixels, and converting hsl to rgb. */
export const getCssVarForStripe = (cssVariable: string): string => {
  const computedValue = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${cssVariable}`)
    .trim()
    .replace("deg", "");

  // There's a bug with pico-css-font-size, so if the cssVariable is a percent, convert it to a number. If its higher than 100, we need to convert it into px units
  if (computedValue.endsWith("%")) {
    const percent = parseFloat(computedValue.replace("%", ""));
    if (percent > 100) {
      //  Just return the base size in pixels
      return convertPercentToPixels(100) + "px";
    }
    return convertPercentToPixels(percent) + "px";
  }

  // If the computedColor starts with hsl, convert it to rgb
  if (computedValue.startsWith("hsl")) {
    const hsl = computedValue.replace("hsl(", "").replace(")", "").split(",");
    const rgb = hsl2rgb(
      parseInt(hsl[0]),
      parseInt(hsl[1]) / 100,
      parseInt(hsl[2]) / 100
    );
    const rgbIn255Scale = rgb.map((c) => Math.round(c * 255));
    return `rgb(${rgbIn255Scale.join(",")})`;
  }

  return computedValue;
};

/**
 * Based on the base fontSize, convert a rem value to pixels
 * @param rem - The rem value to convert to pixels
 * @returns The pixel value
 */
export const convertRemToPixels = (rem: number): number => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

/**
 * Based on the base fontSize, convert a percent value to pixels
 * @param percent - The percent value to convert to pixels
 * @returns The pixel value
 */
export const convertPercentToPixels = (percent: number): number => {
  return (
    (percent / 100) *
    parseFloat(getComputedStyle(document.documentElement).fontSize)
  );
};
