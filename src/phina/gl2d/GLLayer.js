import {Layer} from "phina.js";
import {GLContext} from "@/phina/gl2d/GLContext";
import {Camera} from "@/phina/gl2d/Camera";
import {SpriteRenderer} from "@/phina/gl2d/SpriteRenderer";

/**
 * @class GLLayer
 * 表示用Layerクラス
 * 基本的にはこれしか使わない
 */
export class GLLayer extends Layer {

  constructor(param) {
    super(param);

    this.gl = GLContext.getContext();
    const gl = this.gl;
    if (!gl) {
      console.error("お使いのブラウザはWebGLに対応していません");
      return;
    }

    this.renderChildBySelf = true;
    this.resolution = 1.0;
    this.renderer = null;

    this.domElement = GLContext.getView();
    const sw = this.domElement.width = this.width * this.resolution | 0;
    const sh = this.domElement.height = this.height * this.resolution | 0;

    // 基本設定
    gl.disable(gl.DEPTH_TEST);
    // gl.enable(gl.DEPTH_TEST);
    // gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.CULL_FACE);

    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(0, 0, sw, sh);
    gl.viewport(0, 0, sw, sh);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // 重なったときのブレンドモード：透過
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    // カメラ
    this.camera = new Camera()
      .setPosition(sw * 0.5, sh * 0.5, 1)
      .lookAt(sw * 0.5, sh * 0.5, 0)
      .ortho(-sw * 0.5, sw * 0.5, -sh * 0.5, sh * 0.5, 0, 1)
      .calcVpMatrix();

    // this.rootRenderTarget = phigl.Framebuffer(gl, sw, sh).bind();

    this.renderer = new SpriteRenderer(gl);
    this.renderer.uniforms.vpMatrix.value = this.camera.uniformValues().vpMatrix;
  }

  draw(canvas) {
    const gl = this.gl;
    const image = this.domElement;
    const renderer = this.renderer;

    // webgl未対応の場合
    if (!gl) {
      return Layer.prototype.draw.apply(this, arguments);
    }

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (this.children.length > 0) {
      const tempChildren = this.children.slice();
      for (let i = 0, len = tempChildren.length; i < len; ++i) {
        renderer.render(tempChildren[i]);
      }
      renderer.flush();
    }

    // gl.flush();
    canvas.context.drawImage(image,
      0, 0, image.width, image.height,
      0, 0, this.width, this.height
    );
  }

}
