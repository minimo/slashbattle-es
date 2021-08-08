import {ObjectEx, Sprite, Vector2} from "phina.js";
import {EnemyBase} from "@/phina/elements/EnemyBase";
import {AfterBanner} from "@/phina/elements/AfterBanner";
import {LAYER} from "@/phina/app/Setting";

export class EnemyFighter extends EnemyBase {
  constructor(options) {
    options = ObjectEx.$safe.call(options, { width: 32, height: 32, player: null })
    super(options);

    this.sprite = new Sprite("fighter", 32, 32)
      .setFrameIndex(0)
      .addChildTo(this);

    this.player = options.player;
    this.velocity = new Vector2(0, 0);
    this.angle = 0;
    this.speed = 10;

    this.time = 0;

    this.afterBanner = new AfterBanner()
      .setLayer(this.world.mapLayer[LAYER.effectBackground])
      .attachTo(this);
  }

  update() {
    if (!this.player) return;

    const toPlayer = new Vector2(this.player.x - this.x ,this.player.y - this.y)
    if (toPlayer.length() > 30) {
      //自分から見たプレイヤーの方角
      const r = Math.atan2(toPlayer.y, toPlayer.x);
      let d = (r.toDegree() + 90);
      if (d < 0) d += 360;
      if (d > 360) d -= 360;
      this.angle = Math.floor(d / 22.5);
      this.sprite.setFrameIndex(this.angle);
      this.velocity.add(new Vector2(Math.cos(r) * this.speed, Math.sin(r) * this.speed));
      this.velocity.normalize();
      this.velocity.mul(this.speed);
    }

    this.position.add(this.velocity);

    this.time++;
  }
}