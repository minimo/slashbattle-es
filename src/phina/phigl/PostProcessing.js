import {Drawable} from "@/phina/phigl/Drawable";
import {VertexShader} from "@/phina/phigl/Shader";
import {Program} from "@/phina/phigl/Program";

export class PostProcessing {
  /**
   * @constructor PostProcessing
   */
  constructor(gl, shader, uniforms, width, height) {
    this.gl = gl;

    if (typeof(shader) == "string") {
      shader = new PostProcessing().createProgram(gl, shader);
    }
    width = width || 256;
    height = height || 256;
    uniforms = uniforms || [];

    const sqWidth = Math.pow(2, Math.ceil(Math.log2(width)));
    const sqHeight = Math.pow(2, Math.ceil(Math.log2(height)));

    this.drawer = new Drawable(gl)
      .setDrawMode(gl.TRIANGLE_STRIP)
      .setProgram(shader)
      .setIndexValues([0, 1, 2, 3])
      .setAttributes("position", "uv")
      .setAttributeData([
        //
        -1, +1, 0, height / sqHeight,
        //
        +1, +1, width / sqWidth, height / sqHeight,
        //
        -1, -1, 0, 0,
        //
        +1, -1, width / sqWidth, 0,
      ])
      .setUniforms(["texture", "canvasSize"].concat(uniforms));

    this.width = width;
    this.height = height;
    this.sqWidth = sqWidth;
    this.sqHeight = sqHeight;
  }

  /**
   * @memberOf PostProcessing.prototype
   */
  render(texture, uniformValues) {
    this.drawer.uniforms.texture.setValue(0).setTexture(texture);
    this.drawer.uniforms.canvasSize.value = [this.sqWidth, this.sqHeight];
    if (uniformValues) this.setUniforms(uniformValues);
    this.drawer.draw();
    return this;
  }

  /**
   * @memberOf PostProcessing.prototype
   */
  setUniforms(uniformValues) {
    const uniforms = this.drawer.uniforms;
    uniformValues.forIn(function(k, v) {
      uniforms[k].value = v;
    });
  }

  /**
   * @memberOf PostProcessing.prototype
   */
  calcCoord(x, y) {
    return [x / this.sqWidth, (this.height - y) / this.sqHeight];
  }

  /**
   * @memberOf PostProcessing.prototype
   */
  vertexShaderSource = [
    "attribute vec2 position;",
    "attribute vec2 uv;",

    "varying vec2 vUv;",

    "void main(void) {",
    "  vUv = uv;",
    "  gl_Position = vec4(position, 0.0, 1.0);",
    "}",
  ].join("\n");

  /**
   * @memberOf PostProcessing.prototype
   */
  createProgram(gl, fragmentShader) {
    const vertexShader = new VertexShader(gl);
    vertexShader.data = this.vertexShaderSource;

    return new Program(gl)
      .attach(vertexShader)
      .attach(fragmentShader)
      .link();
  }
}
