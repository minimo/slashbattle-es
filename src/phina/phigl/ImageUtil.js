import {AssetManager, Canvas, ObjectEx} from "phina.js";

export class ImageUtil {

  /**
   * @constructor ImageUtil
   */
  constructor() {}

  /**
   * @memberOf ImageUtil
   */
  static calcSizePowOf2(origWidth, origHeight) {
    const asp = origWidth / origHeight;

    const width = Math.pow(2, Math.ceil(Math.log2(origWidth)));
    const height = Math.pow(2, Math.ceil(Math.log2(origHeight)));

    const fitW = asp > width / height;

    if (fitW) {
      const h = width / asp;
      return {
        srcX: 0,
        srcY: (height - h) * 0.5,
        srcWidth: width,
        srcHeight: h,
        width: width,
        height: height,
      };
    } else {
      const w = height * asp;
      return {
        srcX: (width - w) * 0.5,
        srcY: 0,
        srcWidth: w,
        srcHeight: height,
        width: width,
        height: height,
      };
    }
  }

  /**
   * @memberOf ImageUtil
   */
  static resizePowOf2(options) {
    ObjectEx.$safe.call(options, {
      dst: null,
    });

    let src = options.src;
    if (typeof(src) === "string") {
      src = AssetManager.get("image", src);
    }

    const dst = options.dst || new Canvas();
    const fitW = src.domElement.width < src.domElement.height;
    const asp = src.domElement.width / src.domElement.height;

    if (Math.sqrt(src.domElement.width) % 1 === 0 && Math.sqrt(src.domElement.height) % 1 === 0) {
      return src;
    }

    dst.clear();

    const width = Math.pow(2, Math.ceil(Math.log2(src.domElement.width)));
    const height = Math.pow(2, Math.ceil(Math.log2(src.domElement.height)));
    dst.domElement.width = width;
    dst.domElement.height = height;

    if (fitW) {
      const h = width / asp;
      dst.context.drawImage(src.domElement,
        0, 0, src.domElement.width, src.domElement.height,
        0, (height - h) * 0.5, width, h
      );
    } else {
      const w = height * asp;
      dst.context.drawImage(src.domElement,
        0, 0, src.domElement.width, src.domElement.height,
        (width - w) * 0.5, 0, w, height
      );
    }
    return dst;
  }
}
