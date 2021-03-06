import {Asset} from "phina.js";

export class XMLLoader extends Asset {
  constructor() {
    super();
  }

  _load(resolve) {
    //パス抜き出し
    const last = this.src.lastIndexOf("/");
    if (last > 0) {
      this.path = this.src.substring(0, last + 1);
    } else {
      this.path = "";
    }

    //終了関数保存
    this._resolve = resolve;

    // load
    const xml = new XMLHttpRequest();
    xml.open('GET', this.src);
    xml.onreadystatechange = () => {
      if (xml.readyState === 4) {
        if ([200, 201, 0].indexOf(xml.status) !== -1) {
          const data = (new DOMParser()).parseFromString(xml.responseText, "text/xml");
          this.dataType = "xml";
          this.data = data;
          this._parse(data)
            .then(() => this._resolve(this));
        }
      }
    };
    xml.send(null);
  }

  //XMLプロパティをJSONに変換
  _propertiesToJSON(elm) {
    const properties = elm.getElementsByTagName("properties")[0];
    const obj = {};
    if (properties === undefined) return obj;

    for (let k = 0; k < properties.childNodes.length; k++) {
      const p = properties.childNodes[k];
      if (p.tagName === "property") {
        //propertyにtype指定があったら変換
        const type = p.getAttribute('type');
        const value = p.getAttribute('value') || p.textContent;
        if (type === "int") {
          obj[p.getAttribute('name')] = parseInt(value, 10);
        } else if (type === "float") {
          obj[p.getAttribute('name')] = parseFloat(value);
        } else if (type === "bool" ) {
          obj[p.getAttribute('name')] = value === "true";
        } else {
          obj[p.getAttribute('name')] = value;
        }
      }
    }
    return obj;
  }

  //XML属性をJSONに変換
  _attrToJSON(source) {
    const obj = {};
    for (let i = 0; i < source.attributes.length; i++) {
      let val = source.attributes[i].value;
      val = isNaN(parseFloat(val))? val: parseFloat(val);
      obj[source.attributes[i].name] = val;
    }
    return obj;
  }

  //XML属性をJSONに変換（Stringで返す）
  _attrToJSON_str(source) {
    const obj = {};
    for (let i = 0; i < source.attributes.length; i++) {
      obj[source.attributes[i].name] = source.attributes[i].value;
    }
    return obj;
  }

  //CSVパース
  _parseCSV(data) {
    const dataList = data.split(',');
    const layer = [];

    dataList.forEach(elm => {
      const num = parseInt(elm, 10);
      layer.push(num);
    });

    return layer;
  }

  /**
   * BASE64パース
   * http://thekannon-server.appspot.com/herpity-derpity.appspot.com/pastebin.com/75Kks0WH
   * @private
   */
  _parseBase64(data) {
    const dataList = atob(data.trim()).split('').map(e => e.charCodeAt(0));
    const rst = [];
    for (let i = 0, len = dataList.length / 4; i < len; ++i) {
      const n = dataList[i*4];
      rst[i] = parseInt(n, 10);
    }
    return rst;
  }

  loadDummy() {
  }
}