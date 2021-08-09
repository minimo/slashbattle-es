import {LoadingScene, ManagerScene} from "phina.js";
import {AssetCatalog} from "@/phina/app/AssetCatalog";
import {TitleScene} from "@/phina/scenes/TitleScene";
import {MainScene} from "./MainScene";
import {SCREEN} from "@/phina/app/Setting";

export class SceneFlow extends ManagerScene {
  constructor() {
    super({
      startLabel: "loading",
      scenes: [{
        label: "loading",
        className: LoadingScene,
        nextLabel: "title",
        arguments: {
          assets: AssetCatalog.common,
        },
      },{
        label: "title",
        className: TitleScene,
        nextLabel: "main",
        arguments: {
          title: "SLASH BATTLE",
          width: SCREEN.width,
          height: SCREEN.height,
        },
      },{
        label: "main",
        className: MainScene,
        nextLabel: "title",
      }],
    });
  }
}
