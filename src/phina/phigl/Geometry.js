export class Geometry {
  constructor() {
    this.positions = null;
    this.normals = null;
    this.uvs = null;
    this.indices = null;
  }

  setTo(drawable) {
    const attributeNames = [];
    const attributeDataArray = [];
    if (this.positions) {
      attributeNames.push("position");
      attributeDataArray.push({ unitSize: 3, data: this.positions });
    }
    if (this.normals) {
      attributeNames.push("normal");
      attributeDataArray.push({ unitSize: 3, data: this.normals });
    }
    if (this.uvs) {
      attributeNames.push("uv");
      attributeDataArray.push({ unitSize: 2, data: this.uvs });
    }

    drawable
      .declareAttributes(attributeNames)
      .setAttributeDataArray(attributeDataArray)
      .setIndexValues(this.indices);

    return this;
  }

  setGeometry(geometry) {
    geometry.setTo(this);
    return this;
  }
}
