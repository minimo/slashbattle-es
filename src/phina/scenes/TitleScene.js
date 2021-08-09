import {DisplayScene, Keyboard, Label, ObjectEx} from "phina.js";

export class TitleScene extends DisplayScene {

  constructor(params) {
    params = ObjectEx.$safe.call(params || {}, TitleScene.defaults);
    super(params);

    this.backgroundColor = params.backgroundColor;

    this.fromJSON({
      children: {
        titleLabel: {
          className: Label,
          arguments: {
            text: params.title,
            fill: params.fontColor,
            stroke: false,
            fontSize: 64,
          },
          x: this.gridX.center(),
          y: this.gridY.span(4),
        }
      }
    });

    if (params.exitType === 'touch') {
      this.fromJSON({
        children: {
          touchLabel: {
            className: Label,
            arguments: {
              text: "TOUCH START",
              fill: params.fontColor,
              stroke: false,
              fontSize: 32,
            },
            x: this.gridX.center(),
            y: this.gridY.span(12),
          },
        },
      });
    }
  }

  update(_app) {
    const trigger = _app.keyboard.getKey(Keyboard.KEY_CODE["z"]) || _app.keyboard.getKey(Keyboard.KEY_CODE["space"])
    if (_app.pointer.getPointingStart() || trigger) {
      this.exit();
    }
  }

  static defaults = {
    title: 'phina.js games',
    message: '',

    fontColor: 'white',
    backgroundColor: 'hsl(200, 80%, 64%)',
    backgroundImage: '',

    exitType: 'touch',
  };
}
