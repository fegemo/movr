
export class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static get ZERO() {
    return zero;
  }

  norm() {
    return Math.sqrt(this.x**2 + this.y**2);
  }

  normalize() {
    if (this.isZero()) {
      return this;
    }
    return this.mult(1/this.norm());
  }

  isZero() {
    return this.x === 0 && this.y === 0;
  }
  
  add(other) {
    return new Vector2(this.x + other.x, this.y + other.y);
  }
  
  sub(other) {
    return new Vector2(this.x - other.x, this.y - other.y);
  }
  
  mult(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }
  
  cwMult(other) {
    return new Vector2(this.x * other.x, this.y * other.y);
  }
}

const zero = new Vector2(0, 0);
