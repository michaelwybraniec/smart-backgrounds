/**
 * 2D Vector utilities for animations and calculations
 */

export class Vector2 {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Add another vector
   */
  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  /**
   * Subtract another vector
   */
  subtract(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  /**
   * Multiply by scalar
   */
  multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  /**
   * Divide by scalar
   */
  divide(scalar: number): Vector2 {
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  /**
   * Get magnitude (length)
   */
  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Normalize to unit vector
   */
  normalize(): Vector2 {
    const mag = this.magnitude();
    return mag > 0 ? this.divide(mag) : new Vector2(0, 0);
  }

  /**
   * Calculate distance to another vector
   */
  distanceTo(v: Vector2): number {
    return this.subtract(v).magnitude();
  }

  /**
   * Dot product
   */
  dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * Linear interpolation to another vector
   */
  lerp(v: Vector2, t: number): Vector2 {
    return new Vector2(this.x + (v.x - this.x) * t, this.y + (v.y - this.y) * t);
  }

  /**
   * Clone vector
   */
  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /**
   * Convert to array
   */
  toArray(): [number, number] {
    return [this.x, this.y];
  }

  /**
   * Convert to string
   */
  toString(): string {
    return `Vector2(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
  }

  /**
   * Create from angle (radians)
   */
  static fromAngle(angle: number, magnitude = 1): Vector2 {
    return new Vector2(Math.cos(angle) * magnitude, Math.sin(angle) * magnitude);
  }

  /**
   * Get angle between two vectors
   */
  static angle(v1: Vector2, v2: Vector2): number {
    return Math.atan2(v2.y - v1.y, v2.x - v1.x);
  }
}
