import {Injectable} from '@angular/core';

declare var ColorThief: any;
type Vec3 = [number, number, number];

export interface SongColor {
  vibrant: Vec3;
  muted: Vec3;
}

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  private imgColors: SongColor[] = [];
  private colorThief: any;
  private maxDelta = 60.0;

  constructor() {
    this.colorThief = new ColorThief();
  }

  vec3ToRGBAString(vec: Vec3, opacity: number = 1): string {
    return 'rgba(' + vec[0] + ',' + vec[1] + ',' + vec[2] + ',' + opacity + ')';
  }

  getImgColor(element: any): SongColor {
    const check = this.checkImgStore(element.src);

    if (check === undefined) {

      const palette = this.colorThief.getPalette(element, 3, 50);
      const songColor: SongColor = {
        vibrant: palette[0],
        muted: this.highestDiff(palette, palette[0])
      };
      if (this.deltaE94(songColor.vibrant, songColor.muted) < this.maxDelta) {
        songColor.muted = this.bwContrast(songColor.vibrant);
      }

      this.addImgStore(songColor, element.src);
      return songColor;
    } else {
      return check;
    }
  }

  addImgStore(songColor: SongColor, src: any): void {
    this.imgColors[src] = songColor;
  }

  checkImgStore(src): SongColor {
    return this.imgColors[src];
  }

  clearImgStore(): void {
    this.imgColors = [];
  }

  /***************************************************************************************
   * The functions highestDiff(), rgbDiff(), rgbToCIELab(), rgbToXyz(), xyzToCIELab() and deltaE94()
   * were adapted from npm package node-vibrant.
   *    Title: Node Vibrant source code
   *    Author: Jari Zwarts aka AKFish
   *    Date: 2015
   *    Code version: 3.2
   *    Availability: https://github.com/Vibrant-Colors/node-vibrant
   *
   *    Also see "assets/licenses/node-vibrant_license.md".
   *
   ***************************************************************************************/

  highestDiff(palette, col): any {
    let tap = 0;
    let mit = 0;

    const rgbMain: Vec3 = col;

    let farb;

    const black: Vec3 = [0, 0, 0];
    const white: Vec3 = [255, 255, 255];

    palette.forEach(color => {
      const rgbPal: Vec3 = color;
      tap = this.rgbDiff(rgbPal, rgbMain);

      if (tap >= mit) {
        mit = tap;
        farb = rgbPal;
      }
    });

    if (mit < 50) {
      const dwhite = this.rgbDiff(black, rgbMain);
      const dblack = this.rgbDiff(white, rgbMain);

      if (dblack > dwhite) {
        return black;
      } else {
        return white;
      }
    }
    return farb;
  }

  rgbDiff(rgb1: Vec3, rgb2: Vec3): number {
    const lab1 = this.rgbToCIELab(rgb1[0], rgb1[1], rgb1[2]);
    const lab2 = this.rgbToCIELab(rgb2[0], rgb2[1], rgb2[2]);
    return this.deltaE94(lab1, lab2);
  }

  rgbToCIELab(r: number, g: number, b: number): Vec3 {
    const [x, y, z] = this.rgbToXyz(r, g, b);
    return this.xyzToCIELab(x, y, z);
  }

  rgbToXyz(r: number, g: number, b: number): Vec3 {
    r /= 255;
    g /= 255;
    b /= 255;
    r = r > 0.04045 ? Math.pow((r + 0.005) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.005) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.005) / 1.055, 2.4) : b / 12.92;

    r *= 100;
    g *= 100;
    b *= 100;

    const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

    return [x, y, z];
  }

  xyzToCIELab(x: number, y: number, z: number): Vec3 {
    const REF_X = 95.047;
    const REF_Y = 100;
    const REF_Z = 108.883;

    x /= REF_X;
    y /= REF_Y;
    z /= REF_Z;

    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

    const L = 116 * y - 16;
    const a = 500 * (x - y);
    const b = 200 * (y - z);

    return [L, a, b];
  }

  deltaE94(lab1: Vec3, lab2: Vec3): number {
    const WEIGHT_L = 1;
    const WEIGHT_C = 1;
    const WEIGHT_H = 1;

    const [L1, a1, b1] = lab1;
    const [L2, a2, b2] = lab2;
    const dL = L1 - L2;
    const da = a1 - a2;
    const db = b1 - b2;

    const xC1 = Math.sqrt(a1 * a1 + b1 * b1);
    const xC2 = Math.sqrt(a2 * a2 + b2 * b2);

    let xDL = L2 - L1;
    let xDC = xC2 - xC1;
    const xDE = Math.sqrt(dL * dL + da * da + db * db);

    let xDH = (Math.sqrt(xDE) > Math.sqrt(Math.abs(xDL)) + Math.sqrt(Math.abs(xDC)))
      ? Math.sqrt(xDE * xDE - xDL * xDL - xDC * xDC)
      : 0;

    const xSC = 1 + 0.045 * xC1;
    const xSH = 1 + 0.015 * xC1;

    xDL /= WEIGHT_L;
    xDC /= WEIGHT_C * xSC;
    xDH /= WEIGHT_H * xSH;

    return Math.sqrt(xDL * xDL + xDC * xDC + xDH * xDH);
  }

  /***************************************************************************************/

  bwContrast(rgb: Vec3): Vec3 {
    // http://stackoverflow.com/a/3943023/112731
    return (rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) > 186
      ? [0, 0, 0]
      : [255, 255, 255];
  }

}
