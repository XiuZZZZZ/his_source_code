/**
 * @description 图标分类信息,用于床位分类
 *
 * @class ImageCategory
 */
class ImageCategory {
  constructor() {
    this.categoryDetail = new Map(); // 键值对   图标名称--床位set
    this.category = new Map(); // 键值对   分类名称--图标名称set
    this.categoryDetailIconSrc = new Map(); // 键值对 图标名称--图标IconSrc
    this.categoryImage = new Map(); // 图标
  }
  // [Symbol.iterator]() {
  //   return this.category.keys();
  // }
  /**
   * @description 获取图标分类信息数组
   *
   * @returns
   *
   * @memberof ImageCategory
   */
  getTitles() {
    return [...this.category.keys()];
  }
  /**
   *
   *
   * @param {any} detailName
   * @returns
   *
   * @memberof ImageCategory
   */
  getImage(detailName) {
    return this.categoryImage.get(detailName);
  }
  /**
   * @description 获取图标名称数组
   *
   * @param {any} title 图标分类名称
   * @returns
   *
   * @memberof ImageCategory
   */
  getDetailNames(title) {
    return [...this.category.get(title).values()];
  }
  /**
   * @description 获取图标对应的病人人数
   *
   * @param {any} detailName 图标名称
   * @returns
   *
   * @memberof ImageCategory
   */
  getDetailSize(detailName) {
    return this.categoryDetail.get(detailName).size;
  }
  /**
   * @description 获取图标的图片地址
   *
   * @param {any} detailName  图标名称
   * @returns
   *
   * @memberof ImageCategory
   */
  getDetailIconSrc(detailName) {
    return this.categoryDetailIconSrc.get(detailName);
  }

  /**
   * @description 添加图标分类信息
   *
   * @param {any} bed  Bed实体数据
   *
   * @memberof ImageCategory
   */
  add(bed) {
    if (bed.images.length !== 0) {
      bed.images.forEach(image => {
        if (image.category === '') {
          return;
        }
        this.categoryImage.set(image.originTitle, image);
        if (!this.category.get(image.category)) {
          const categoryTitle = new Set();
          categoryTitle.add(image.originTitle);
          this.category.set(image.category, categoryTitle);
        } else {
          this.category.get(image.category).add(image.originTitle);
        }
        if (!this.categoryDetail.get(image.originTitle)) {
          const detail = new Set();
          detail.add(bed);
          this.categoryDetail.set(image.originTitle, detail);
          this.categoryDetailIconSrc.set(image.originTitle, image.iconSrc);
        } else {
          this.categoryDetail.get(image.originTitle).add(bed);
        }
      });
    }
  }
}
export default ImageCategory;
