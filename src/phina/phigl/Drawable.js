import {EventDispatcher, ObjectEx} from "phina.js";
import {Ibo} from "@/phina/phigl/Ibo";
import {Vbo} from "@/phina/phigl/Vbo";
import {Extensions} from "@/phina/phigl/Extensions";

export class Drawable extends EventDispatcher {

  /**
   * @constructor Drawable
   * @param  {WebGLRenderingContext} gl
   * @param {OES_vertex_array_object?} extVao
   * @extends {EventDispatcher}
   */
  constructor(gl, extVao) {
    super();
    /** @type {WebGLRenderingContext} */
    this.gl = gl;
    /** @type {OES_vertex_array_object} */
    this.extVao = extVao;
    /** @type {Program} */
    this.program = null;
    /** @type {Ibo} */
    this.indices = null;
    /** @type {Array.<Attribute>} */
    this.attributes = [];
    /** @type {number} */
    this.stride = 0;
    /** @type {Object.<string, Uniform>} */
    this.uniforms = {};
    /** @type {Vbo} */
    this.vbo = null;
    /** @type {number} */
    this.drawMode = gl.TRIANGLES;
    /** @type {WebGLVertexArrayObjectOES} */
    this.vao = null;
  }

  /**
   * @param {number} mode
   * @return {this}
   */
  setDrawMode(mode) {
    this.drawMode = mode;
    return this;
  }

  /**
   * @param {Program} program
   * @return {this}
   */
  setProgram(program) {
    this.program = program;
    program.use();
    ObjectEx.$extend.call(this.uniforms, program._uniforms);
    return this;
  }

  /**
   * @param {Array.<number>} value
   * @return {this}
   */
  setIndexValues(value) {
    if (!this.indices) this.indices = new Ibo(this.gl);
    this.indices.set(value);
    return this;
  }

  /**
   * @param {Ibo} ibo
   * @memberOf Drawable.prototype
   * @return {this}
   */
  setIndexBuffer(ibo) {
    this.indices = ibo;
    return this;
  }

  /**
   * @param {Array.<string>} names
   * @return {this}
   */
  declareAttributes(names) {
    names = Array.prototype.concat.apply([], arguments);

    let stride = 0;
    for (let i = 0; i < names.length; i++) {
      let attr = names[i];
      if (typeof attr === "string") attr = this.program.getAttribute(attr);
      this.attributes.push(attr);
      attr._offset = stride;
      stride += attr.size * 4;
    }
    this.stride = stride;
    return this;
  }

  setAttributes(names) {
    console.warn("deprecated");
    return this.declareAttributes(names);
  }

  /**
   * @param {Array.<number>} data
   * @param {number=} usage default = gl.STATIC_DRAW
   * @return {this}
   */
  setAttributeData(data, usage) {
    if (!this.vbo) {
      this.vbo = new Vbo(this.gl, usage);
    }
    this.vbo.set(data);

    this.vbo.bind();
    const stride = this.stride;
    this.attributes.forEach(function(v) { v.specify(stride) });
    Vbo.unbind(this.gl);

    return this;
  }

  /**
   * @param {Array.<object>} dataArray [{ unitSize: n, data: [number] }, ...]
   * @param {number=} usage default = gl.STATIC_DRAW
   * @memberOf Drawable.prototype
   * @return {this}
   */
  setAttributeDataArray(dataArray, usage) {
    if (!this.vbo) {
      this.vbo = new Vbo(this.gl, usage);
    }
    this.vbo.setAsInterleavedArray(dataArray);

    this.vbo.bind();
    const stride = this.stride;
    this.attributes.forEach(function(v) { v.specify(stride) });
    Vbo.unbind(this.gl);

    return this;
  }

  /**
   * @param {Vbo} vbo
   * @return {this}
   */
  setAttributeVbo(vbo) {
    this.vbo = vbo;

    this.vbo.bind();
    const stride = this.stride;
    this.attributes.forEach(function(v) { v.specify(stride) });
    Vbo.unbind(this.gl);

    return this;
  }

  /**
   * @return {this}
   */
  createVao() {
    const gl = this.gl;
    const stride = this.stride;

    if (!this.extVao) this.extVao = new Extensions.getVertexArrayObject(gl);
    if (!this.vao) this.vao = this.extVao.createVertexArrayOES();

    this.extVao.bindVertexArrayOES(this.vao);

    if (this.indices) this.indices.bind();

    if (this.vbo) this.vbo.bind();
    this.attributes.forEach(function(v) {
      v.specify(stride);
      gl.enableVertexAttribArray(v._location);
    });

    this.extVao.bindVertexArrayOES(null);

    Ibo.unbind(gl);
    Vbo.unbind(gl);

    return this;
  }

  /**
   * @param {Array.<string>} names
   * @memberOf Drawable.prototype
   * @return {this}
   */
  declareUniforms(names) {
    names = Array.prototype.concat.apply([], arguments);

    const program = this.program;
    const map = Array.prototype.reduce.call(names, function(m, name) {
      m[name] = program.getUniform(name);
      return m;
    }, {});
    ObjectEx.$extend.call(this.uniforms, map)
    return this;
  }

  setUniforms(names) {
    console.warn("deprecated");
    return this.declareUniforms(names);
  }

  draw() {
    // console.log("-- begin");

    const gl = this.gl;
    const ext = this.extVao;

    this.program.use();

    if (this.vao) {
      ext.bindVertexArrayOES(this.vao);
    } else {
      if (this.indices) this.indices.bind();
      if (this.vbo) this.vbo.bind();
      const stride = this.stride;
      this.attributes.forEach(function(v) {
        v.enable();
        v.specify(stride);
      });
    }

    ObjectEx.forIn.call(this.uniforms, function(k, v) { v.assign() });

    this.flare("predraw");
    this.gl.drawElements(this.drawMode, this.indices.length, gl.UNSIGNED_SHORT, 0);
    this.flare("postdraw");

    if (this.vao) {
      ext.bindVertexArrayOES(null);
    } else {
      Ibo.unbind(gl);
      Vbo.unbind(gl);
    }

    this.attributes.forEach(function(v) {
      v.disable();
    });
    ObjectEx.forIn.call(this.uniforms, function(k, v) { v.reassign() });

    // console.log("-- end");
  }

  delete() {
    const ext = this.ext;
    this.program.delete();
    if (this.vao) {
      ext.deleteVertexArrayOES(this.vao);
    } else {
      this.indices.delete();
      this.vbo.delete();
    }
  }
}
