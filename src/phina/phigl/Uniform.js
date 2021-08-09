import {GLTexture} from "@/phina/phigl/GLTexture";

export class Uniform {
  /**
   * @constructor Uniform
   * @param {WebGLRenderingContext} gl
   * @param {Program} program
   * @param {string} name
   * @param {any} type
   */
  constructor(gl, program, name, type) {
    this.gl = gl;
    this.name = name;

    this._location = gl.getUniformLocation(program, name);
    this._type = type;
    this.texture = null;

    this._location = null;
    this._value = null;
    this._uniformMethod = null;

    switch (type) {
      case gl.BOOL:
        this._uniformMethod = "uniform1i";
        break;
      case gl.FLOAT:
        this._uniformMethod = "uniform1f";
        break;
      case gl.FLOAT_VEC2:
        this._uniformMethod = "uniform2fv";
        break;
      case gl.FLOAT_VEC3:
        this._uniformMethod = "uniform3fv";
        break;
      case gl.FLOAT_VEC4:
        this._uniformMethod = "uniform4fv";
        break;
      case gl.FLOAT_MAT2:
        this._uniformMethod = "uniformMatrix2fv";
        break;
      case gl.FLOAT_MAT3:
        this._uniformMethod = "uniformMatrix3fv";
        break;
      case gl.FLOAT_MAT4:
        this._uniformMethod = "uniformMatrix4fv";
        break;
      case gl.SAMPLER_2D:
        this._uniformMethod = "uniform1i";
        break;
    }
  }

  setValue(value) {
    this._value = value;
    return this;
  }

  setTexture(texture) {
    if (typeof(texture) === "string") {
      texture = new GLTexture(this.gl, texture);
    }
    this.texture = texture;
    return this;
  }

  assign() {
    let gl = this.gl;

    switch (this._type) {
      case gl.BOOL:
      case gl.FLOAT:
      case gl.FLOAT_VEC2:
      case gl.FLOAT_VEC3:
      case gl.FLOAT_VEC4:
        gl[this._uniformMethod](this._location, this._value);
        break;
      case gl.FLOAT_MAT2:
      case gl.FLOAT_MAT3:
      case gl.FLOAT_MAT4:
        gl[this._uniformMethod](this._location, false, this._value);
        break;
      case gl.SAMPLER_2D:
        if (this.texture) this.texture.bind(this._value);
        gl[this._uniformMethod](this._location, this._value);
        break;
    }

    return this;
  }

  reassign() {
    let gl = this.gl;

    switch (this._type) {
      case gl.SAMPLER_2D:
        if (this.texture) GLTexture.unbind(gl);
        break;
    }
    return this;
  }

  get value() {
    return this._value;
  }
  set value(v) {
    this.setValue(v);
  }
}
