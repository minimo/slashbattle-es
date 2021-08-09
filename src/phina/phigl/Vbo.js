let i = 0;

export class Vbo {
  /**
   * @constructor Vbo
   * @param {WebGLRenderingContext} gl context
   * @param {number=} usage default = gl.STATIC_DRAW
   */
  constructor(gl, usage) {
    this.gl = gl;
    this.usage = usage || gl.STATIC_DRAW;
    this._vbo = gl.createBuffer();
    this._vbo._id = i++;
    this.array = null;
  }

  set(data) {
    const gl = this.gl;
    if (this.array) {
      this.array.set(data);
    } else {
      this.array = new Float32Array(data);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
    gl.bufferData(gl.ARRAY_BUFFER, this.array, this.usage);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return this;
  }

  /**
   * @param {Array.<object>} dataArray [{ unitSize: n, data: [number] }, ...]
   * @memberOf phigl.Vbo.prototype
   */
  setAsInterleavedArray(dataArray) {
    const dataCount = dataArray.length;
    const vertexCount = dataArray[0].data.length / dataArray[0].unitSize;
    const interleavedArray = [];
    for (let i = 0; i < vertexCount; i++) {
      for (let j = 0; j < dataCount; j++) {
        const d = dataArray[j];
        for (let k = 0; k < d.unitSize; k++) {
          interleavedArray.push(d.data[i * d.unitSize + k]);
        }
      }
    }
    return this.set(interleavedArray);
  }

  updateInterleavedArray(sectionSize, offset, unitSize, data) {
    for (let i = 0, len = data / unitSize; i < len; i++) {
      for (let j = 0; j < unitSize; j++) {
        this.array[i * sectionSize + offset + j] = data[i * unitSize + j];
      }
    }
    this.set(this.array);
    return this;
  }

  bind() {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
    // console.log("bindBuffer", this._vbo, this.array.length);
    return this;
  }

  delete() {
    this.gl.deleteBuffer(this._vbo);
  }

   static unbind(gl) {
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // console.log("unbind")
  }
}