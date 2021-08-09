import {GLTexture} from "@/phina/phigl/GLTexture";

export class FloatTexFramebuffer {
  /**
   * @constructor phigl.FloatTexFramebuffer
   * @param  {WebGLRenderingContext} gl context
   * @param {number} width
   * @param {number} height
   * @param {any} options
   */
  constructor(gl, width, height, options) {
    options = options || {};

    this.gl = gl;
    this.width = width;
    this.height = height;

    /**
     * @type {WebGLFramebuffer}
     * @private
     */
    this._framebuffer = gl.createFramebuffer();
    /**
     *  @type {GLTexture}
     */
    this.texture = null;

    gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer);

    // // depth_stencil
    // this._depthStencilRenderbuffer = gl.createRenderbuffer();
    // gl.bindRenderbuffer(gl.RENDERBUFFER, this._depthStencilRenderbuffer);
    // gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
    // gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this._depthStencilRenderbuffer);

    // color
    this.texture = new GLTexture(gl);
    this._texture = this.texture._texture;
    gl.bindTexture(gl.TEXTURE_2D, this._texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, options.magFilter || gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, options.minFilter || gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._texture, 0);

    // reset
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  bind() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._framebuffer);
    gl.viewport(0, 0, this.width, this.height);
    return this;
  }

  delete() {
    const gl = this.gl;
    gl.deleteFramebuffer(this._framebuffer);
    this.texture.delete();
    return this;
  }

  /** @param  {WebGLRenderingContext} gl */
  static unbind(gl) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}
