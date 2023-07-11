<template>
  <div class="bedList">
    <li class="bedList__listLi" v-if="index===titleIndex">
      <div class="bedList__col col1">
        <div class="bedList__colCell">
          <div class="bedList__title">
            <el-checkbox></el-checkbox>
          </div>
        </div>
      </div>
      <div class="bedList__col" v-for="(info,index) of listColumns">
        <div class="bedList__colCell">
          <div class="bedList__title">{{info.description}}</div>
        </div>
      </div>
    </li>
    <li class="bedList__listLi fadeInRightS" :style="{animationDelay: `${(data.showIndex/25)}s` }">
      <span class="bedList__tag">一级护理</span>
      <span class="bedList__tagDays">12</span>
      <div class="col col1">
        <div class="bedList__colCell">
          <div class="bedList__value">
            <el-checkbox></el-checkbox>
          </div>
        </div>
      </div>
      <div class="bedList__col" v-for="(info,index) of listColumns">
        <div class="bedList__colCell">
          <div class="bedList__value" :style="{color:info.key==='name'?'#FF6A00':'black'}">{{data.patient[info.key]}}</div>
          <!--<div class="title">{{info.description}}</div>-->
        </div>
      </div>
      <div class="bedList__col">
        <div class="bedList__colCell">
          <div class="bedList__value">
            <a href="#" v-for="image of data.images">
              <img class="bedList_icon" :src="'../images/'+image.iconSrc" @click="clickImage(image)" :title="image.title">
            </a>
          </div>
        </div>
      </div>
    </li>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'BedList',
  props: ['data', 'index', 'titleIndex'],
  watch: {
    titleIndex(value) {
      console.log(value);
    },
  },
  computed: {
    ...mapGetters(['infoSetting', 'beds', 'bedListSetting']),
    listColumns() {
      const listColumnsAarray = [];
      this.bedListSetting.bedListColumns.forEach(key => {
        for (const elem of this.infoSetting.infoData.values()) {
          if (elem.key === key) {
            listColumnsAarray.push(elem);
            break;
          }
        }
      });
      return listColumnsAarray;
    },
  },
  // methods: {
  //   ifShowColumn(info) {
  //     return this.bedListSetting.bedListColumns.includes(info.key);
  //   },
  // },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import '../../assets/main.css';
@b bedList {
  @e listLi {
    position: relative;
    width: 98%;
    height: 70px;
    margin: 0 10px;
    border-bottom: 1px solid #f2f2f2;
    background-color: white;
    cursor: pointer;
  }
  &:hover {
    z-index: 1;
    border-bottom: 1px solid white;
    box-shadow: 0 0 24px #d9d9d9;
  }
  @e title {
    color: #b0b0b0;
    font-size: 14px;
  }
  @e value {
    color: #333;
    font-size: 16px;
    padding-bottom: 4px;
  }
  @e tag {
    position: absolute;
    top: 0;
    left: 100px;
    height: 20px;
    width: 62px;
    background-color: #ff6a00;
    color: white;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
  }
  @e tagDays {
    position: absolute;
    top: 0;
    left: 50px;
    height: 20px;
    color: #a0b9eb;
    min-width: 20px;
    background-color: white;
    font-size: 12px;
    line-height: 20px;
    border-radius: 20px;
    text-align: center;
  }
  @e icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin: 0 0 0 8px;
  }
  @e col {
    float: left;
    text-align: center;
    width: 8%;
    height: 100%;
  }
  @e colCell {
    height: 70px;
    vertical-align: middle;
    text-align: center;
    display: table-cell;
  }
}

/*.value {
  color: #333;
  font-size: 16px;
}*/

/*.title {
  color: #B0B0B0;
  font-size: 14px;
}*/

/*.col {
  float: left;
  text-align: center;
  width: 8%;
  height: 100%;
}*/

.col1 {
  padding-left: 32px;
}

.col-cell {
  height: 70px;
  margin: 0 auto;
  vertical-align: middle;
  text-align: center;
  display: table-cell;
}

/*.tag {
  position: absolute;
  top: 0;
  left: 100px;
  height: 20px;
  width: 62px;
  background-color: #FF6A00;
  color: white;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
}*/

/*.tagDays {
  position: absolute;
  top: 0;
  left: 50px;
  height: 20px;
  color: #A0B9EB;
  min-width: 20px;
  background-color: white;
  font-size: 12px;
  line-height: 20px;
  border-radius: 20px;
  text-align: center;
}*/

/*.icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin: 0 0 0 8px;
}*/
</style>
