import {DisplayScene, ObjectEx} from "phina.js";
import {SCREEN} from "@/phina/app/Setting";

export class BaseScene extends DisplayScene {

  constructor(options) {
    super(ObjectEx.$safe.call({}, options, { width: SCREEN.width, height: SCREEN.height, backgroundColor: 'transparent'}));
  }

  // eslint-disable-next-line no-unused-vars
  update(_app) {}
}
