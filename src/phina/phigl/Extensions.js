export class Extensions {

  static getVertexArrayObject(gl) {
    return this._get(gl, "OES_vertex_array_object");
  }

  static getInstancedArrays(gl) {
    return this._get(gl, "ANGLE_instanced_arrays");
  }

  static _get(gl, name) {
    let ext = gl.getExtension(name);
    if (ext) {
      return ext;
    } else {
      throw name + " is not supported";
    }
  }
}