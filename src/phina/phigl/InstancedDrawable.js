import {ObjectEx} from "phina.js";
import {Ibo} from "@/phina/phigl/Ibo";
import {Vbo} from "@/phina/phigl/Vbo";
import {Drawable} from "@/phina/phigl/Drawable";

export class InstancedDrawable extends Drawable {
  /**
   * @constructor InstancedDrawable
   * @extends {Drawable}
   * @param  {WebGLRenderingContext} gl context
   * @param {ANGLE_instanced_arrays} extInstancedArrays value of gl.getExtension('ANGLE_instanced_arrays')
   */
  constructor(gl, extInstancedArrays) {
    super(gl);
    this.ext = extInstancedArrays;
    this.instanceAttributes = [];

    this.instanceVbo = null;
    this.instanceStride = 0;
  }

  declareInstanceAttributes(names) {
    names = Array.prototype.concat.apply([], arguments);
    let stride = 0;
    for (let i = 0; i < names.length; i++) {
      let attr = names[i];
      if (typeof attr === "string") attr = this.program.getAttribute(attr);
      this.instanceAttributes.push(attr);
      attr._offset = stride;
      stride += attr.size * 4;
    }
    this.instanceStride = stride;

    return this;
  }

  setInstanceAttributes(names) {
    console.warn("deprecated");
    return this.declareInstanceAttributes(names);
  }

  setInstanceAttributeVbo(vbo) {
    this.instanceVbo = vbo;

    this.instanceVbo.bind();
    let iStride = this.instanceStride;
    this.instanceAttributes.forEach(function(v) { v.specify(iStride) });
    Vbo.unbind(this.gl);

    return this;
  }

  setInstanceAttributeData(data) {
    if (!this.instanceVbo) this.instanceVbo = new Vbo(this.gl, this.gl.DYNAMIC_DRAW);
    this.instanceVbo.set(data);

    this.instanceVbo.bind();
    let iStride = this.instanceStride;
    this.instanceAttributes.forEach(function(v) { v.specify(iStride) });
    Vbo.unbind(this.gl);

    return this;
  }

  setInstanceAttributeDataArray(dataArray) {
    if (!this.instanceVbo) this.instanceVbo = new Vbo(this.gl);
    this.instanceVbo.setAsInterleavedArray(dataArray);

    this.instanceVbo.bind();
    let iStride = this.instanceStride;
    this.instanceAttributes.forEach(function(v) { v.specify(iStride) });
    Vbo.unbind(this.gl);

    return this;
  }

  createVao() {
    return this;
  }

  draw(instanceCount) {
    let gl = this.gl;
    let ext = this.ext;

    this.program.use();

    if (this.indices) this.indices.bind();
    if (this.vbo) this.vbo.bind();
    let stride = this.stride;
    this.attributes.forEach(function(v) {
      v.enable();
      v.specify(stride);
    });

    if (this.instanceVbo) this.instanceVbo.bind();
    let iStride = this.instanceStride;
    this.instanceAttributes.forEach(function(v) {
      v.enable();
      v.specify(iStride);
      ext.vertexAttribDivisorANGLE(v._location, 1);
    });

    ObjectEx.forIn.call(this.uniforms, function(k, v) { v.assign() });

    this.flare("predraw");
    this.ext.drawElementsInstancedANGLE(this.drawMode, this.indices.length, gl.UNSIGNED_SHORT, 0, instanceCount);
    this.flare("postdraw");

    this.attributes.forEach(function(v) {
      v.disable();
    });
    this.instanceAttributes.forEach(function(v) {
      v.disable();
      ext.vertexAttribDivisorANGLE(v._location, 0);
    });
    Ibo.unbind(gl);
    Vbo.unbind(gl);
  }
}
