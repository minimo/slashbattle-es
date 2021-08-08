import {DisplayElement, ObjectEx, RectangleShape} from "phina.js";

export class GameObject extends DisplayElement {
  constructor(options) {
    options = ObjectEx.$safe.call({}, options, { world: null, width: 16, height: 16 })
    super(options);
    this.world = options.world;
    this.collision = new RectangleShape({ width: options.width, height: options.height }).addChildTo(this);
    this.collision.alpha = 0.0;
    this.time = 0;
    this.on('enterframe', () => this.time++);
  }

  /**
   * @virtual
   * 更新用仮想関数
   */
  // eslint-disable-next-line no-unused-vars
  update(_app) {}
}
