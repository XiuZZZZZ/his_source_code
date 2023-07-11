<template>
  <div class="bedSearch">
    <div v-for="(title,index) of categorysData.getTitles()"
    :key="index">
      <span class="bedSearch__title">{{title}}</span>
      <ul class="bedSearch__list">
        <li class="bedSearch__item"
            v-for="(detailName,index) of categorysData.getDetailNames(title)"
            :key="index"
            :class="{ 'is-selected': selectedInfo.images.has(detailName)}"
            @click.stop="clickSearchItem(detailName)">
          <img class="bedSearch__icon"
               :style="{visibility: (categorysData.getDetailIconSrc(detailName)==='')?'hidden':'visible'}"
               :src="'../images/'+categorysData.getDetailIconSrc(detailName)">
          <a href="#"
             class="bedSearch__name">{{detailName}}
            <span class="bedSearch__num">{{categorysData.getDetailSize(detailName)}}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import ImageCategory from "../../store/object/imageCategory";

export default {
  name: "BedSearch",
  data() {
    return {
      categorysData: new ImageCategory()
    };
  },
  computed: {
    ...mapGetters(["beds", "selectedInfo", "imagesInitState"])
  },
  watch: {
    imagesInitState(value) {
      if (value === "finish") {
        this.initData();
        this.finishBedsUpdate();
      }
    }
  },
  methods: {
    initData() {
      this.categorysData = new ImageCategory();
    },
    finishBedsUpdate() {
      const that = this;
      const beds = this.beds;
      beds.forEach(bed => {
        if (bed.unavailReason === "") {
          that.categorysData.add(bed);
        }
      });
    },
    clickSearchItem(image) {
      this.$store.commit("updateSelectedInfo", {
        image
      });
      this.setBedsDisplay();
      this.$forceUpdate();
    },
    setBedsDisplay() {
      const images = Array.from(this.selectedInfo.images);
      this.beds.forEach((bed, index) => {
        const flag =
          images.length === 0 ||
          (bed.matchImages(images) && bed.unavailReason === "");
        this.$store.commit("updateBedShowState", {
          ifShow: flag,
          ifFloat: images.length === 0 ? false : flag,
          index
        });
      });
    },
    mouseover() {
      this.$emit("mouseover");
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../../assets/main.css";
@b bedSearch {
  background-color: #ffffff;
  border: 1px solid #cccccc;
  padding: 5px 5px;
  font-size: 14px;
  line-height: 30px;
  white-space: nowrap;
  text-align: left;
  &:before {
    content: "";
    display: block;
    position: absolute;
    z-index: -1;
    top: -10px;
    bottom: -10px;
    left: -10px;
    right: -10px;
  }
  @e title {
    color: #3f7db4;
    margin-left: 10px;
    min-width: 60px;
    display: inline-block;
  }
  @e num {
    display: inline-block;
    line-height: 14px;
    font-size: 12px;
    margin: 0 5px;
    padding: 1px 5px;
    background-color: #ff7368;
    color: #fff;
    border-radius: 2px;
    min-width: 10px;
    text-align: center;
  }
  @e list {
    display: inline-block;
  }
  @e item {
    display: inline-block;
    /* margin-left: 38px; */
    padding: 0 10px;
    /* width: 160px;*/
    @when selected {
      background-color: #cfecfd;
    }
  }
  @e icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    position: relative;
    top: 3px;
    margin: 0 0 0 8px;
  }
}
</style>
