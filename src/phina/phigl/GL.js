export class GL {
  static getId(gl) {
    if (gl.id == null) {
      gl.id = "phigl-WebGLRenderingContext-" + (new Date()).getTime().toString(16) + Math.floor(Math.random() * 1000).toString(16);
    }
    return gl.id;
  }
}
