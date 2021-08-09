import {AssetManager, DisplayElement, ObjectEx, Sprite} from "phina.js";
import {BaseScene} from "@/phina/scenes/BaseScene";
import {SCREEN} from "@/phina/app/Setting";
import {GLLayer} from "@/phina/gl2d/GLLayer";

export class MainScene extends BaseScene {

  constructor(options) {
    super(ObjectEx.$safe.call(options || {}, {width: SCREEN.width, height: SCREEN.height, backgroundColor: 'black'}));
    this.setup();
  }

  setup() {
    // this.back = new Sprite("back")
    //   .setOrigin(0, 0)
    //   .setScale(1.5)
    //   .addChildTo(this);

    this.base = new DisplayElement().setPosition(-50, -250).addChildTo(this);

    this.glLayer = new GLLayer({width: SCREEN.width, height: SCREEN.height}).addChildTo(this);

    //マップ作成
    this.data = AssetManager.get('tmx', "map1");
    const image = this.data.getImage();
    new Sprite(image)
      .setOrigin(0, 0)
      .addChildTo(this);
    new Sprite("actor4")
      .addChildTo(this.glLayer);
  }

  update() {
    //
  }
}
