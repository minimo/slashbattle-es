export class Attribute {
  /**
   * @constructor Attribute
   * @param  {WebGLRenderingContext} gl context
   * @param  {Program} program
   * @param  {string} name
   * @param  {number} type
   */
  constructor(gl, program, name, type) {
    this.gl = gl;
    this.name = name;

    this._location = null;
    this._type = null;
    this._ptype = null;
    this._offset = 0;

    this._location = gl.getAttribLocation(program, name);
    if (this._location === -1) {
      throw "attribute " + name + " not found";
    }
    // this.enable();

    this._type = type;
    switch (type) {
      case gl.BOOL:
        this.size = 1;
        this._ptype = gl.BOOL;
        break;
      case gl.FLOAT:
        this.size = 1;
        this._ptype = gl.FLOAT;
        break;
      case gl.FLOAT_VEC2:
        this.size = 2;
        this._ptype = gl.FLOAT;
        break;
      case gl.FLOAT_VEC3:
        this.size = 3;
        this._ptype = gl.FLOAT;
        break;
      case gl.FLOAT_VEC4:
        this.size = 4;
        this._ptype = gl.FLOAT;
        break;
    }
  }

  /**
   * @memberOf Attribute.prototype
   * @param  {number} stride
   * @return {this}
   */
  specify(stride) {
    // console.log("attribute", this.name, this._location);
    this.gl.vertexAttribPointer(this._location, this.size, this._ptype, false, stride, this._offset);
    return this;
  }

  enable() {
    this.gl.enableVertexAttribArray(this._location);
    return this;
  }

  disable() {
    this.gl.disableVertexAttribArray(this._location);
    return this;
  }

}
