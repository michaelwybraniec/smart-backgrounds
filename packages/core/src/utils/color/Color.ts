/**
 * Color utilities for conversion and manipulation
 */

export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r = 0, g = 0, b = 0, a = 1) {
    this.r = Math.max(0, Math.min(255, r));
    this.g = Math.max(0, Math.min(255, g));
    this.b = Math.max(0, Math.min(255, b));
    this.a = Math.max(0, Math.min(1, a));
  }

  /**
   * Convert to HEX string
   */
  toHex(): string {
    const r = Math.round(this.r).toString(16).padStart(2, '0');
    const g = Math.round(this.g).toString(16).padStart(2, '0');
    const b = Math.round(this.b).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  /**
   * Convert to RGB string
   */
  toRgb(): string {
    return `rgb(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)})`;
  }

  /**
   * Convert to RGBA string
   */
  toRgba(): string {
    return `rgba(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)}, ${this.a})`;
  }

  /**
   * Convert to HSL
   */
  toHSL(): HSL {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const sum = max + min;

    let h = 0;
    let s = 0;
    const l = sum / 2;

    if (diff !== 0) {
      s = l > 0.5 ? diff / (2 - sum) : diff / sum;

      if (max === r) {
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
      } else if (max === g) {
        h = ((b - r) / diff + 2) / 6;
      } else {
        h = ((r - g) / diff + 4) / 6;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  /**
   * Convert to HSL string
   */
  toHslString(): string {
    const { h, s, l } = this.toHSL();
    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  /**
   * Create from HEX string
   */
  static fromHex(hex: string): Color {
    const cleaned = hex.replace('#', '');
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    return new Color(r, g, b);
  }

  /**
   * Create from RGB values
   */
  static fromRgb(r: number, g: number, b: number, a = 1): Color {
    return new Color(r, g, b, a);
  }

  /**
   * Create from HSL values
   */
  static fromHSL(h: number, s: number, l: number): Color {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return new Color(r * 255, g * 255, b * 255);
  }

  /**
   * Lighten color
   */
  lighten(amount: number): Color {
    const hsl = this.toHSL();
    hsl.l = Math.min(100, hsl.l + amount);
    return Color.fromHSL(hsl.h, hsl.s, hsl.l);
  }

  /**
   * Darken color
   */
  darken(amount: number): Color {
    const hsl = this.toHSL();
    hsl.l = Math.max(0, hsl.l - amount);
    return Color.fromHSL(hsl.h, hsl.s, hsl.l);
  }

  /**
   * Mix with another color
   */
  mix(other: Color, weight = 0.5): Color {
    return new Color(
      this.r + (other.r - this.r) * weight,
      this.g + (other.g - this.g) * weight,
      this.b + (other.b - this.b) * weight,
      this.a + (other.a - this.a) * weight
    );
  }

  /**
   * Clone color
   */
  clone(): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }
}
