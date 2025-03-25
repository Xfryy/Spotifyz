declare module 'colorthief' {
  type RGBColor = [number, number, number];
  
  class ColorThief {
    constructor();
    getColor(img: HTMLImageElement): RGBColor;
    getPalette(img: HTMLImageElement, colorCount?: number): RGBColor[];
  }

  export = ColorThief;
}