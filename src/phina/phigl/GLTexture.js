import {AssetManager} from "phina.js";

export class GLTexture {
  /**
   * @constructor GLTexture
   * @param  {WebGLRenderingContext} gl
   * @param  {(string|Texture|Canvas)=} image
   * @param {function} funcSetting
   */
  constructor(gl, image, funcSetting) {
    this.gl = gl;

    /** @type {WebGLTexture} */
    this._texture = gl.createTexture();

    if (image) {
      this.setImage(image, funcSetting);
    }
  }

  /**
   * @memberOf GLTexture.prototype
   * @param {string|Texture|Canvas} image
   * @param {function} funcSetting
   */
  setImage(image, funcSetting) {
    const gl = this.gl;
    if (typeof image === "string") {
      image = AssetManager.get("image", image);
    }
    funcSetting = funcSetting || function(gl) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.generateMipmap(gl.TEXTURE_2D);
    };

    gl.bindTexture(gl.TEXTURE_2D, this._texture);
    funcSetting(gl);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image.domElement);

    gl.bindTexture(gl.TEXTURE_2D, null);

    return this;
  }

  /**
   * @memberOf GLTexture.prototype
   * @param {number} unitIndex
   */
  bind(unitIndex) {
    const gl = this.gl;
    gl.activeTexture(gl["TEXTURE" + (unitIndex || 0)]);
    gl.bindTexture(gl.TEXTURE_2D, this._texture);
    return this;
  }

  /**
   * @memberOf GLTexture.prototype
   */
  delete() {
    this.gl.deleteTexture(this._texture);
  }

  /**
   * @memberOf GLTexture.prototype
   * @param  {WebGLRenderingContext} gl
   */
  static unbind(gl) {
    gl.bindTexture(gl.TEXTURE_2D, null);
    return this;
  }
}
