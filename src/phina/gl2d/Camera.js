import {MatIV} from "@/phina/gl2d/MatIV";

export class Camera {
  constructor() {
    this.position = new Array(3);
    this.vMatrix = MatIV.create();
    this.pMatrix = MatIV.create();
    this.vpMatrix = MatIV.create();
  }

  setPosition(x, y, z) {
    // vec3.set(this.position, x, y, z);
    this.position[0] = x;
    this.position[1] = y;
    this.position[2] = z;
    return this;
  }

  lookAt(x, y, z) {
    MatIV.lookAt(this.position, [x, y, z], [0, 1, 0], this.vMatrix);
    return this;
  }

  ortho(left, right, top, bottom, near, far) {
    MatIV.ortho(left, right, top, bottom, near, far, this.pMatrix);
    return this;
  }

  calcVpMatrix() {
    // mat4.multiply(this.vpMatrix, this.pMatrix, this.vMatrix);
    MatIV.multiply(this.pMatrix, this.vMatrix, this.vpMatrix)
    return this;
  }

  uniformValues() {
    return {
      vpMatrix: this.vpMatrix,
      cameraPosition: this.position,
    };
  }
}
