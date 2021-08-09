export class Detector {
  /**
   * @memberOf Detector
   * @property {boolean}
   */
  isEnable() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      return !!(window.WebGLRenderingContext && gl && gl.getShaderPrecisionFormat);
    } catch (e) {
      return false;
    }
  }
}
