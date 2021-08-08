import {Sprite, Vector2} from "phina.js";

export class ParticleSprite extends Sprite {
  static defaults = {
    // 初期スケール
    scale: 1.0,
    // スケールダウンのスピード
    scaleDecay: 0.01,
  };

  constructor(options) {
    super("particle", 16, 16);

    this.blendMode = 'lighter';

    this.velocity = options.velocity || new Vector2(0, 0);
    const scale = options.scale || ParticleSprite.defaults.scale;
    this.scaleX = scale;
    this.scaleY = scale;
    this.scaleDecay = options.scaleDecay || ParticleSprite.defaults.scaleDecay;
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.x *= 0.99;
    this.velocity.y *= 0.99;
    this.scaleX -= this.scaleDecay;
    this.scaleY -= this.scaleDecay;

    if (this.scaleX < 0) this.remove();
  }

  setVelocity(x, y) {
    if (x instanceof Vector2) {
      this.velocity = x.clone();
      return this;
    }
    this.velocity.x = x;
    this.velocity.y = y;
    return this;
  }
}
