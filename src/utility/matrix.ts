import Point from './point'

class Matrix {
  a: number
  b: number
  c: number
  d: number
  tx: number
  ty: number

  constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
    this.a = a
    this.b = b
    this.c = c
    this.d = d
    this.tx = tx
    this.ty = ty
  }

  concat(matrix: Matrix): Matrix {
    return new Matrix(
      this.a * matrix.a + this.c * matrix.b,
      this.b * matrix.a + this.d * matrix.b,
      this.a * matrix.c + this.c * matrix.d,
      this.b * matrix.c + this.d * matrix.d,
      this.a * matrix.tx + this.c * matrix.ty + this.tx,
      this.b * matrix.tx + this.d * matrix.ty + this.ty,
    )
  }

  deltaTransformPoint(point: Point): Point {
    return new Point(this.a * point.x + this.c * point.y, this.b * point.x + this.d * point.y)
  }

  inverse(): Matrix {
    const determinant = this.a * this.d - this.b * this.c
    return new Matrix(
      this.d / determinant,
      -this.b / determinant,
      -this.c / determinant,
      this.a / determinant,
      (this.c * this.ty - this.d * this.tx) / determinant,
      (this.b * this.tx - this.a * this.ty) / determinant,
    )
  }

  rotate(theta: number, aboutPoint?: Point): Matrix {
    return this.concat(Matrix.rotation(theta, aboutPoint))
  }

  scale(sx: number, sy: number = sx, aboutPoint?: Point): Matrix {
    return this.concat(Matrix.scale(sx, sy, aboutPoint))
  }

  transformPoint(point: Point): Point {
    return new Point(
      this.a * point.x + this.c * point.y + this.tx,
      this.b * point.x + this.d * point.y + this.ty,
    )
  }

  translate(tx: number, ty: number): Matrix {
    return this.concat(Matrix.translation(tx, ty))
  }

  static rotation(theta: number, aboutPoint?: Point): Matrix {
    let rotationMatrix = new Matrix(
      Math.cos(theta),
      Math.sin(theta),
      -Math.sin(theta),
      Math.cos(theta),
    )

    if (aboutPoint) {
      rotationMatrix = Matrix.translation(aboutPoint.x, aboutPoint.y)
        .concat(rotationMatrix)
        .concat(Matrix.translation(-aboutPoint.x, -aboutPoint.y))
    }

    return rotationMatrix
  }

  static scale(sx: number, sy: number = sx, aboutPoint?: Point): Matrix {
    let scaleMatrix = new Matrix(sx, 0, 0, sy)

    if (aboutPoint) {
      scaleMatrix = Matrix.translation(aboutPoint.x, aboutPoint.y)
        .concat(scaleMatrix)
        .concat(Matrix.translation(-aboutPoint.x, -aboutPoint.y))
    }

    return scaleMatrix
  }

  static translation(tx: number, ty: number): Matrix {
    return new Matrix(1, 0, 0, 1, tx, ty)
  }

  static IDENTITY(): Matrix {
    return new Matrix()
  }

  static VERTICAL_FLIP(): Matrix {
    return new Matrix(1, 0, 0, -1)
  }

  static HORIZONTAL_FLIP(): Matrix {
    return new Matrix(-1, 0, 0, 1)
  }
}

export default Matrix
