/**
 * @class phina.gl2d.GLContext
 * context管理用
 */
export class GLContext {
  static _view = null;
  static _context = null;

  static getView() {
    if (!this._view) this._view = document.createElement("canvas");
    return this._view;
  }

  static getContext() {
    if (!this._view) this._view = document.createElement("canvas");
    if (!this._context) this._context = this._view.getContext("webgl") || this._view.getContext("experimental-webgl");
    return this._context;
  }
}
