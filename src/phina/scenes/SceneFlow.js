import {LoadingScene, ManagerScene} from "phina.js";
import {AssetCatalog} from "@/phina/app/AssetCatalog";
import {TitleScene} from "@/phina/scenes/TitleScene";
import {MainScene} from "./MainScene";

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
          title: "MANEUVER"
        },
      },{
        label: "main",
        className: MainScene,
        nextLabel: "title",
      }],
    });
  }
}
