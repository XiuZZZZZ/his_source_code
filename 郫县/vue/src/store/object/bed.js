import pinyinUtil from '../../comm/pinyinUtil';

/**
 * @description 床位信息实体类
 *
 * @class Bed
 */
class Bed {
  constructor(data) {
    Object.keys(data).forEach(key => {
      this[key] = data[key];
    });
    this.ifShow = true;
    this.ifFloat = false;
    this.images = [];
    this.needToDeal = false;
  }
  /**
   * @description 判断床位是否符合该字符串
   *
   * @param {any} query  查询字符串
   * @returns  true:符合 false:不符合
   *
   * @memberof Bed
   */
  match(query, keyCode) {
    const queryStr = query.toUpperCase();
    let showFlag = false;
    if (!showFlag && this[keyCode]) {
      const content = String(this[keyCode]);
      if (
        content.indexOf(queryStr) > -1 ||
        content.toUpperCase().indexOf(queryStr) > -1 ||
        pinyinUtil.getFirstLetter(content).indexOf(queryStr) > -1
      ) {
        showFlag = true;
      }
    }
    if (!showFlag && this.patient.episodeID && this.patient[keyCode]) {
      const patient = this.patient;
      const content = String(patient[keyCode]);
      if (
        content.indexOf(queryStr) > -1 ||
        content.toUpperCase().indexOf(queryStr) > -1 ||
        pinyinUtil.getFirstLetter(content).indexOf(queryStr) > -1
      ) {
        showFlag = true;
      }
    }
    return showFlag;
  }
  /**
   * @description 判断床位是否包含该图标
   *
   * @param {any} image
   * @returns
   *
   * @memberof Bed
   */
  matchImages(selectedImages) {
    const flags = selectedImages.map(selectedImage => {
      let flag = false;
      this.images.forEach(image => {
        flag = image.originTitle === selectedImage ? true : flag;
      });
      return flag;
    });
    return flags.indexOf(false) === -1;
  }
}

export default Bed;
