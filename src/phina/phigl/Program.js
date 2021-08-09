import {AssetManager} from "phina.js";
import {Attribute} from "@/phina/phigl/Attribute";
import {Uniform} from "@/phina/phigl/Uniform";

let id = 0;

export class Program {

  static currentUsing = null

  /**
   * @constructor Program
   * @param  {WebGLRenderingContext} gl context
   */
  constructor(gl) {
    this.gl = gl;

    this._program = gl.createProgram();
    this._program._id = id++;
    this.linked = false;

    this._attributes = {};
    this._uniforms = {};

    this._shaders = [];

    this._vbo = null;
  }

  /**
   * @param {string|Shader} shader
   * @return {this}
   */
  attach(shader) {
    const gl = this.gl;

    if (typeof shader === "string") {
      shader = AssetManager.get("vertexShader", shader) || AssetManager.get("fragmentShader", shader);
    }

    if (!shader.compiled) {
      shader.compile(gl);
    }

    gl.attachShader(this._program, shader._shader);

    this._shaders.push(shader);

    return this;
  }

  /**
   * @return {this}
   */
  link() {
    const gl = this.gl;

    gl.linkProgram(this._program);
    gl.validateProgram(this._program);

    if (gl.getProgramParameter(this._program, gl.LINK_STATUS)) {

      const attrCount = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
      for (let i = 0; i < attrCount; i++) {
        const attr = gl.getActiveAttrib(this._program, i);
        this.getAttribute(attr.name, attr.type);
      }

      const uniCount = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniCount; i++) {
        const uni = gl.getActiveUniform(this._program, i);
        if (uni.size > 1) {
          for (let j = 0; j < uni.size; j++) {
            const name = uni.name.replace("[0]", "[" + j + "]");
            this.getUniform(name, uni.type);
          }
        } else {
          this.getUniform(uni.name, uni.type);
        }
      }

      this.linked = true;
      return this;
    } else {
      this.linked = false;
      throw gl.getProgramInfoLog(this._program);
    }
  }

  /**
   * @param {string} name
   * @param {number} type
   * @return {Attribute}
   */
  getAttribute(name, type) {
    if (!this._attributes[name]) {
      this._attributes[name] = new Attribute(this.gl, this._program, name, type);
    }
    return this._attributes[name];
  }

  /**
   * @param {string} name
   * @param {number} type
   * @return {Uniform}
   */
  getUniform(name, type) {
    if (!this._uniforms[name]) {
      this._uniforms[name] = new Uniform(this.gl, this._program, name, type);
    }
    return this._uniforms[name];
  }

  /**
   * @return {this}
   */
  use() {
    if (Program.currentUsing === this) return this;
    this.gl.useProgram(this._program);
    Program.currentUsing = this;
    return this;
  }

  /**
   * @memberOf phigl.Program.prototype
   * @return {this}
   */
  delete() {
    const gl = this.gl;
    const program = this._program;
    this._shaders.forEach(function(shader) {
      gl.detachShader(program, shader._shader);
    });
    this._shaders.forEach(function(shader) {
      gl.deleteShader(shader._shader);
    });
    gl.deleteProgram(program);
    return this;
  }
}
