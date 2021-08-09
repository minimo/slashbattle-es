import {Geometry} from "@/phina/phigl/Geometry";
import {ObjectEx} from "phina.js";

export class PlaneXY extends Geometry{

  constructor(options) {
    super(options);
    options = ObjectEx.$safe.call(options, PlaneXY.defaults);

    this.width = options.width;
    this.height = options.height;
    this.normalsEnabled = options.normalsEnabled;

    this.positions = [
      // 左上
      options.width * -0.5, options.height * +0.5, 0,
      // 左下
      options.width * -0.5, options.height * -0.5, 0,
      // 右上
      options.width * +0.5, options.height * +0.5, 0,
      // 右下
      options.width * +0.5, options.height * -0.5, 0,
    ];
    if (this.normalsEnabled) {
      this.normals = [
        // 左上
        0, 0, 1,
        // 左下
        0, 0, 1,
        // 右上
        0, 0, 1,
        // 右下
        0, 0, 1,
      ];
    }
    this.uvs = [
      // 左上
      0, 1,
      // 左下
      0, 0,
      // 右上
      1, 1,
      // 右下
      1, 0,
    ];
    this.indices = [0, 1, 2, 2, 1, 3];
  }

  static defaults = {
    width: 1,
    height: 1,
    normalsEnabled: true,
  }
}
