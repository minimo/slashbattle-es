import {DisplayElement, Keyboard, MathEx, Random, RectangleShape} from "phina.js";
import {Player} from "@/phina/elements/Player";
import {LAYER, SCREEN} from "@/phina/app/Setting";

export class World extends DisplayElement {
  constructor(options) {
    super(options);
    this.setup();
    this.time = 0;
  }

  update(_app) {
    this.controlPlayer(_app);
    this.time++;
  }

  setup() {
    this.mapBase = new DisplayElement().setPosition(0, 0).addChildTo(this);

    //レイヤー構築
    this.mapLayer = [];
    for (let i = 0; i < LAYER.num; i++) {
      this.mapLayer[i] = new DisplayElement().addChildTo(this.mapBase);
    }

    this.player = new Player({ world: this })
        .setPosition(SCREEN.width / 2, SCREEN.height / 2 - 100)
        .addChildTo(this.mapLayer[LAYER.player]);

    this.setupMap();
  }

  setupMap() {
    for (let i = 0; i < 1000; i++) {
      new RectangleShape({
        width: Random.randint(50, 200),
        height: Random.randint(50, 200),
        fill: 'blue',
        stroke: '#aaa',
        strokeWidth: 4,
        cornerRadius: 0,
        x: Random.randint(-10000, 10000),
        y: Random.randint(-5000, 5000),
      }).addChildTo(this.mapLayer[LAYER.background]);
    }
  }

  controlPlayer(app) {
    const player = this.player;
    let ct = app.keyboard;
    if (this.time % 3 === 0) {
      if (ct.getKey(Keyboard.KEY_CODE["left"])) {
        player.direction--;
        if (player.direction < 0) player.direction = 15;
      } else if (ct.getKey(Keyboard.KEY_CODE["right"])) {
        player.direction++;
        if (player.direction > 15) player.direction = 0;
      }
      player.sprite.setFrameIndex(player.direction);
    }
    if (ct.getKey(Keyboard.KEY_CODE["up"])) {
      player.speed += 0.002;
      if (player.speed > 1) player.speed = 1;
      const rad = MathEx.degToRad(player.direction * 22.5)
      player.velocity.x += Math.sin(rad) * player.speed;
      player.velocity.y += -Math.cos(rad) * player.speed;
      if (player.velocity.length > 2) {
        player.velocity.normalize();
        player.velocity.mul(2);
      }
    } else {
      player.speed *= 0.98;
    }

    //下に落ちる
    if (!ct.getKey(Keyboard.KEY_CODE["up"])) player.velocity.y += 0.1;

    player.position.add(player.velocity);
    player.velocity.mul(0.99);

    //アフターバーナー
    if (ct.getKey(Keyboard.KEY_CODE["up"])) {
      const v = player.velocity.clone().mul(-1)
      player.afterBanner[0].enable().setVelocity(v);
      player.afterBanner[1].enable().setVelocity(v);
    } else {
      player.afterBanner[0].disable();
      player.afterBanner[1].disable();
    }

    if (ct.a) {
      //
    }

    this.mapBase.x = SCREEN.width / 2  - player.x - player.velocity.x * 3;
    this.mapBase.y = SCREEN.height / 2 - player.y - player.velocity.y * 3;
  }
}
