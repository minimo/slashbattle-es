export class Ibo {
  /**
   * @constructor Ibo
   * @param  {WebGLRenderingContext} gl
   */
  constructor(gl) {
    this.gl = gl;
    this._buffer = gl.createBuffer();
    this.length = 0;
  }

  set(data) {
    const gl = this.gl;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    this.length = data.length;
    return this;
  }

  bind() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this._buffer);
    return this;
  }

  delete() {
    this.gl.deleteBuffer(this._buffer);
    return this;
  }

  static unbind(gl) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return this;
  }

  get value() {
    return null;
  }
  set value(v) {
    this.set(v);
  }
}
