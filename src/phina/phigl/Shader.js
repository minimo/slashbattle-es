import {AssetLoader, File} from "phina.js";

export class Shader extends File{
  /**
   * @constructor Shader
   * @extends {File}
   */
  constructor() {
    super();
    this.gl = null;
    this.type = null;
    this.compiled = false;
    this.assetType = null;
    this._shader = null;
  }

  loadDummy() {
    super.loadDummy();
  }

  setSource(text) {
    this.data = text;
    return this;
  }

  /**
   * @memberOf phigl.Shader.prototype
   */
  compile(gl) {
    this._resolveInclude();
    this.gl = gl;
    this.type = this._type(gl);

    this._shader = gl.createShader(this.type);
    gl.shaderSource(this._shader, this.data);
    gl.compileShader(this._shader);

    if (gl.getShaderParameter(this._shader, gl.COMPILE_STATUS)) {
      this.compiled = true;
      return this;
    } else {
      this.compiled = false;
      throw gl.getShaderInfoLog(this._shader);
    }
  }

  _resolveInclude() {
    const lines = this.data.split(/(\n|\r\n)/);
    const includes = lines.map((line, index) => {
      if (line.startsWith("// <include>")) {
        const name = line.replace("// <include>", "").trim();
        const code = phina.asset.AssetManager.get(this.assetType, name);
        if (code == null) {
          throw `そんなシェーダーないです (${name})`;
        } else {
          return code.data;
        }
      } else {
        return line;
      }
    });
    this.data = includes.join("\n");
  }

  _type(gl) {
    return 0;
  }

  delete() {
    this.gl.deleteShader(this._shader);
  }
}

export class VertexShader extends Shader{
  /**
   * @constructor phigl.VertexShader
   * @extends {Shader}
   */
  constructor() {
    super();
    this.assetType = "vertexShader";
  }

  _type(gl) {
    return gl.VERTEX_SHADER;
  }
}

export class FragmentShader extends Shader {
  /**
   * @constructor FragmentShader
   * @extends {Shader}
   */
  constructor() {
    super();
    this.assetType = "fragmentShader";
  }

  _type(gl) {
    return gl.FRAGMENT_SHADER;
  }
}

export class ShaderRegister {
  static register() {
    AssetLoader.register("vertexShader",  function(key, path) {
      const shader = new VertexShader();
      return shader.load({
        path: path,
      });
    });

    AssetLoader.register("fragmentShader", function(key, path) {
      const shader = new FragmentShader();
      return shader.load({
        path: path,
      });
    });
  }
}
