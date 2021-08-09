import {GL} from "@/phina/phigl/GL";

export class WebGLCanvasPool {
  constructor() {
    this._pool = [];
    this._actives = [];

    this.webglParameters = {};
  }

  create() {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl", this.webglParameters);
    canvas.webglId = GL.getId(gl);
    return canvas;
  }

  get() {
    if (this._pool.length === 0) {
      const canvas = this.create();
      const self = this;
      canvas.release = function() {
        self.dispose(this);
      };
      this._pool.push(canvas);
    }

    const result = this._pool.shift();
    this._actives.push(result);
    return result;
  }

  dispose(canvas) {
    if (this._actives.contains(canvas)) {
      this._actives.erase(canvas);
      this._pool.push(canvas);
    }
  }
}
