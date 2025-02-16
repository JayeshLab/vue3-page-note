class Point {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x || 0
    this.y = y || 0
  }

  equal(other: Point): boolean {
    return this.x === other.x && this.y === other.y
  }

  add(other: Point): Point {
    return new Point(this.x + other.x, this.y + other.y)
  }

  subtract(other: Point): Point {
    return new Point(this.x - other.x, this.y - other.y)
  }

  scale(scalar: number): Point {
    return new Point(this.x * scalar, this.y * scalar)
  }

  magnitude(): number {
    return Point.distance(new Point(0, 0), this)
  }

  static distance(p1: Point, p2: Point): number {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
  }

  static direction(p1: Point, p2: Point): number {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x)
  }
}

export default Point
