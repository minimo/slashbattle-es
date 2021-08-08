import {Accessory, Vector2} from "phina.js";
import {ParticleSprite} from "@/phina/elements/ParticleSprite";

export class AfterBanner extends Accessory {
  constructor(target) {
    super(target);
    this.offset = new Vector2(0, 0);
    this.velocity = new Vector2(0, 0);
    this.isDisable = true;
    this.before = null;
  }

  setLayer(layer) {
    this.layer = layer;
    return this;
  }

  enable() {
    this.isDisable = false;
    return this;
  }

  disable() {
    this.isDisable = true;
    return this;
  }

  setOffset(x, y) {
    if (x instanceof Vector2) {
      this.offset.set(x.x, x.y);
      return this;
    }
    this.offset.set(x, y);
    return this;
  }

  setVelocity(x, y) {
    if (x instanceof Vector2) {
      this.velocity = x.clone().mul(-1);
      return this;
    }
    this.velocity.x = x;
    this.velocity.y = y;
    return this;
  }

  update() {
    if (this.isDisable) {
      this.before = null;
      return;
    }
    const target = this.target;
    const options = { scale: 0.3 };
    const pos = target.position.clone().add(this.offset);
    if (this.before) {
      const dis = target.position.distance(this.before);
      const numSplit = Math.max(Math.floor(dis / 3), 6);
      const unitSplit = (1 / numSplit);
      for (let i = 0; i < numSplit; i++) {
        const per = unitSplit * i;
        const pPos = new Vector2(pos.x * per + this.before.x * (1 - per), pos.y * per + this.before.y * (1 - per));
        new ParticleSprite(options).setPosition(pPos.x, pPos.y).addChildTo(this.layer);
      }
      this.before.set(pos.x, pos.y);
    } else {
      this.before = new Vector2(pos.x, pos.y);
    }
  }

}