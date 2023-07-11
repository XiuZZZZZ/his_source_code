<template>
  <div class="patInfoBanner__patInfo">
    <span class="patInfoBanner__buttons">
      <slot></slot>
    </span>
    <span class="patInfoBanner__patAvartar">
      <a href="#">
        <img class="patInfoBanner__patAvartar--image" :src="'../images/uiimages/bed/'+getSexIcon" />
      </a>
    </span>
    <span>
      <div class="patInfoBanner__patInfoText">
        <template v-if="patInfo&&patInfo.bedCode">
          <span class="patInfoBanner__patInfoText--name">{{patInfo&&patInfo.bedCode}}床</span>
          <span class="patInfoBanner__sep">|</span>
        </template>
        <span class="patInfoBanner__patInfoText--name">{{patInfo&&patInfo.name}}</span>
        <span class="patInfoBanner__sep">|</span>
        <span class="patInfoBanner__patInfoText--otherInfo">{{patInfo&&patInfo.age}}</span>
        <span class="patInfoBanner__sep">|</span>
        <span class="patInfoBanner__patInfoText--otherInfo">{{patInfo&&patInfo.regNo}}</span>
        <span class="patInfoBanner__sep">|</span>
        <span class="patInfoBanner__patInfoText--otherInfo">{{patInfo&&patInfo.admReason}}</span>
        <span class="patInfoBanner__sep">|</span>
        <span class="patInfoBanner__patInfoText--otherInfo">{{patInfo&&patInfo.ctLocDesc}}</span>
        <span class="patInfoBanner__sep">|</span>
        <span class="patInfoBanner__patInfoText--otherInfo">{{patInfo&&patInfo.wardDesc}}</span>
        <span class="patInfoBanner__sep">|</span>
        <span class="patInfoBanner__patInfoText--otherInfo">{{patInfo&&patInfo.transLocDesc}}</span>
        <span class="patInfoBanner__sep">|</span>
        <template v-if="ifShowDays||false">
          <span class="patInfoBanner__patInfoText--otherInfo">{{patInfo&&patInfo.inHospDateTime}}</span>
          <span class="patInfoBanner__sep">|</span>
          <span class="patInfoBanner__patInfoText--otherInfo">住院:</span>
          <span class="patInfoBanner__patInfoText--inDays">{{patInfo&&patInfo.inDays}}</span>
          <span class="patInfoBanner__patInfoText--otherInfo">天</span>
          <template v-if="patInfo.operLaterDays&&patInfo.operLaterDays>0">
            <span class="patInfoBanner__sep">|</span>
            <span class="patInfoBanner__patInfoText--otherInfo">术后:</span>
            <span class="patInfoBanner__patInfoText--inDays">{{patInfo&&patInfo.operLaterDays}}</span>
            <span class="patInfoBanner__patInfoText--otherInfo">天</span>
          </template>
        </template>
      </div>
      <div class="patInfoBanner__patInfoIcon">
        <a href="#" v-for="(image,index) of images" :key="index" v-if="image.iconSrc!==''">
          <img
            class="patInfoBanner__patInfoIcon--icon"
            :src="'../images/'+image.iconSrc"
            @click="clickImage(image)"
            :title="image.title"
          />
        </a>
        &nbsp;
      </div>
    </span>
  </div>
</template>
<script>
import patientApi from "../../store/api/patient";

export default {
  props: ["patInfo", "ifShowDays"],
  data() {
    return {
      images: []
    };
  },
  mounted() {
    this.getPatImages();
  },
  watch: {
    patInfo() {
      this.getPatImages();
    }
  },
  computed: {
    getSexIcon() {
      let icon = "unman.png";
      if (this.patInfo && this.patInfo.sex === "女") {
        icon = "fmaleAvatar.png";
      }
      if (this.patInfo && this.patInfo.sex === "男") {
        icon = "maleAvatar.png";
      }
      return icon;
    }
  },
  methods: {
    getPatImages() {
      if (this.patInfo && this.patInfo.episodeID) {
        const { episodeID } = this.patInfo;
        patientApi.getImages(episodeID).then(images => {
          if (images) {
            this.images = images;
          }
        });
      } else {
        this.images = [];
      }
    },
    clickImage(image) {
      const { linkUrl, location } = image;
      if (linkUrl) {
        /* global websys_createWindow:true */
        websys_createWindow(
          linkUrl,
          image.title,
          location.replace(/"/g, ""),
          ""
        );
      }
    }
  }
};
</script>

<style>
@import "../../assets/main.css";

@b patInfoBanner {
  @e patInfo {
    padding: 4px;
    height: 56px;
    position: relative;
    vertical-align: middle;
    border-bottom: 1px #ccc solid;
  }
  @e patInfoText {
    vertical-align: middle;
    padding: 5px 0px 5px 68px;
    font-size: var(--navFontSize);
    color: black;
    @m name {
      display: table-cell;
      vertical-align: middle;
      font-size: 22px;
      /* var(--navFontSize)*/
    }
    @m otherInfo {
      vertical-align: middle;
      display: table-cell;
      padding: 0px;
    }
    @m inDays {
      vertical-align: middle;
      display: table-cell;
      color: red;
      padding: 0px;
    }
  }
  @e patAvartar {
    float: left;
    @m image {
      height: 56px;
    }
  }
  @e sep {
    display: table-cell;
    color: #bbbbbb;
    vertical-align: middle;
    padding: 0 0.5em;
    font-family: sans-serif;
  }
  @e patInfoIcon {
    text-align: left;
    margin: 0 0 0 65px;
    @m icon {
      width: 16px;
      height: 16px;
      margin: 0 0 0 5px;
    }
  }
  @e buttons {
    display: inline-block;
    line-height: 56px;
    padding-right: 10px;
    float: right;
  }
}
</style>

