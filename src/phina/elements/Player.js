import {MathEx, ObjectEx, Sprite, Vector2} from "phina.js";
import {GameObject} from "@/phina/elements/GameObject";
import {AfterBanner} from "@/phina/elements/AfterBanner";
import {LAYER} from "@/phina/app/Setting";

export class Player extends GameObject {
  constructor(options) {
    options = ObjectEx.$safe.call({}, options, { width: 32, height: 32 });
    super(options);

    this.sprite = new Sprite("fighter", 32, 32).setFrameIndex(0).addChildTo(this)
    this.afterBanner = [];
    this.direction = 0;
    this.speed = 1;
    this.velocity = new Vector2(0, 0);

    for(let i = 0; i < 2; i++) {
      this.afterBanner[i] = new AfterBanner()
        .setLayer(this.world.mapLayer[LAYER.effectBackground])
        .disable()
        .attachTo(this);
    }
  }

  update() {
    const rad = MathEx.degToRad(this.direction * 22.5)
    const x = -Math.sin(rad) * 8;
    const y = Math.cos(rad) * 8;
    for(let i = 0; i < 2; i++) {
      const px = afterBannerOffset[this.direction][i].x;
      const py = afterBannerOffset[this.direction][i].y;
      this.afterBanner[i].setOffset( x + px, y + py);
    }
  }
}

const afterBannerOffset = [
  [ {x: -3, y:  0}, {x:  3, y:  0}, ], //  0 上

  [ {x: -3, y:  2}, {x:  3, y: -2}, ], //  1
  [ {x: -3, y:  2}, {x:  2, y:  0}, ], //  2
  [ {x: -3, y:  3}, {x:  0, y: -1}, ], //  3

  [ {x:  0, y:  0}, {x:  0, y:  0}, ], //  4 左

  [ {x: -3, y:  0}, {x:  3, y:  0}, ], //  5
  [ {x: -1, y: -2}, {x:  2, y:  2}, ], //  6
  [ {x: -3, y: -2}, {x:  3, y:  0}, ], //  7

  [ {x:  3, y:  0}, {x: -3, y:  0}, ], //  8 下

  [ {x:  3, y: -2}, {x: -3, y:  0}, ], //  9
  [ {x:  1, y: -2}, {x: -2, y:  2}, ], // 10
  [ {x:  3, y:  0}, {x: -3, y:  0}, ], // 11

  [ {x:  0, y:  0}, {x:  0, y:  0}, ], // 12 右

  [ {x: -3, y:  3}, {x:  0, y: -1}, ], // 13
  [ {x:  3, y:  2}, {x: -2, y:  0}, ], // 14
  [ {x:  3, y:  2}, {x: -3, y: -2}, ], // 15
];
