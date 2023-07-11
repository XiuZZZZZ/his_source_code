<template>
  <div class="patSearch">
      <div class="patSearch__title">预约患者查询</div>
      <div class="patSearch__searchCondition">
          <ul class="patSearch__searchUl">
                <li class="patSearch__searchLi">   
                    <span class="patSearch__datePickerLabel">开始日期</span>                          
                    <span class="patSearch__datePickerLabel">结束日期</span> 
                </li> 
                <li class="patSearch__searchLi"> 
                     <yl-date-picker class="patSearch__dataPicker"
                        align="right"
                        type="date"
                        v-model="form.startDate"
                        :picker-options="startDateOptions">
                    </yl-date-picker>                   
                    <yl-date-picker class="patSearch__dataPicker"
                        align="right"
                        type="date"
                        v-model="form.endDate"
                        :picker-options="endDateOptions">
                    </yl-date-picker>
                </li>
                <li class="patSearch__searchLi">                     
                    <span class="patSearch__datePickerLabel">住院证号</span> 
                    <span class="patSearch__datePickerLabel">预约科室</span>
                </li> 
                 <li class="patSearch__searchLi"> 
                    <el-input class="patSearch__input" v-model="form.bookNo"></el-input>
                    <yl-select class="patSearch__input" v-model="form.bookLoc" 
                        size="small" @update:data="value=>dialogLocs=value" 
                        filterable :filter-method="filterLoc" clearable
                        :runServerMethodStr="getLocMethodStr"
                        ref="locSelect">
                        <el-option v-for="item in dialogLocs" :key="item.ID" :label="item.desc" :value="item.ID"></el-option>
                    </yl-select>
                </li>
                <li class="patSearch__searchLi">                               
                    <span class="patSearch__datePickerLabel">登记号</span>
                    <span class="patSearch__datePickerLabel">预约病区</span>
                </li>
                 <li class="patSearch__searchLi">                     
                    <el-input class="patSearch__input" v-model="form.regNo" @keydown.enter.native="completeReg"></el-input>
                    <yl-select class="patSearch__input" v-model="form.bookWard" 
                        size="small" @update:data="value=>dialogWards=value" 
                        filterable :filter-method="filterWard" clearable
                        :runServerMethodStr="getWardMethodStr"
                        ref="wardSelect">
                        <el-option v-for="item in dialogWards" :key="item.ID" :label="item.desc" :value="item.ID"></el-option>
                    </yl-select>
                  </li>
                <li class="patSearch__searchLi">   
                    <span class="patSearch__datePickerLabel">姓名</span>
                    <span class="patSearch__datePickerLabel">预约医生</span>
                </li> 
                 <li class="patSearch__searchLi">                   
                    <el-input class="patSearch__input" v-model="form.patName"></el-input>
                    <yl-select size="mini" class="patSearch__input" v-model="form.bookDoctor" 
                      @update:data="value=>bookDocs=value" filterable 
                      :filter-method="filterDoctor" clearable
                      :runServerMethodStr="getDoctorMethodStr" 
                      ref="docSelect">
                      <el-option v-for="item in bookDocs" :key="item.ID" :label="item.name" :value="item.ID"></el-option>
                    </yl-select>
                </li>
                <li class="patSearch__searchLi"> 
                    <el-button class="patSearch__searchBtn" type="primary"  @click="onSearch">查询</el-button>
                </li>                
          </ul> 
      </div>   
      <span class="patSearch__splitLine"></span>
      <div class="patSearch__patTable">
          <el-table
            :data="tableData"
            :border="true"
            @row-dblclick="rowDbClick"
            style="width: 800"
            height="380">
            <el-table-column
              fixed
              prop="bookNo"
              label="住院证号"
              width="130">
            </el-table-column>            
            <el-table-column
              fixed
              prop="bookStatus"
              label="状态"
              width="80">
            </el-table-column>
            <el-table-column
              fixed
              prop="name"
              label="姓名"   
              width="140"
            >
            </el-table-column>
             <el-table-column
              fixed
              prop="patRegNo"
              label="登记号"
              width="110">
            </el-table-column>
            <el-table-column
              prop="sex"
              label="性别"
              width="100">
            </el-table-column>
            <el-table-column
              prop="age"
              label="年龄"
              width="100">
            </el-table-column>
            <el-table-column
              prop="tel"
              label="电话"
              width="130">
            </el-table-column>
            <el-table-column
              prop="bookLoc"
              label="预约科室"
              width="160">            
            </el-table-column>
            <el-table-column
              prop="appWard"
              label="预约病区"
              width="160">            
            </el-table-column>
            <el-table-column
              prop="appDate"
              label="预约时间"
              width="130">            
            </el-table-column>
            <el-table-column
              prop="bookCreateUser"
              label="开证医生"
              width="100">
            </el-table-column>
            <el-table-column
              prop="operName"
              label="日间手术"
              width="130">
            </el-table-column>
            <el-table-column
              prop="operDate"
              label="手术日期"
              width="150">
            </el-table-column>
            <el-table-column
              prop="bookdoc"
              label="预约医生"
              width="150">
            </el-table-column>
        </el-table>
      </div>
  </div>
</template>
<script>
import apointApi from "../../store/api/appointPatOrder";
import utils from "../../comm/utils";
import pinyinUtil from "../../comm/pinyinUtil";
import Select from "../../components/Select";
import DatePicker from "../../components/DatePicker";

export default {
  name: "PatSearch",
  data() {
    return {
      dialogLocs: [],
      dialogWards: [],
      bookDocs: [],
      form: {
        bookNo: "",
        regNo: "",
        startDate: "",
        endDate: "",
        patName: "",
        bookLoc: "",
        bookWard: "",
        bookDoctor: ""
      },
      tableData: [
        {
          age: "",
          appDate: "",
          appWard: "",
          bookCreateUser: "",
          bookID: "",
          bookLoc: "",
          bookNo: "",
          bookStatus: "",
          bookdoc: "",
          episodeIDTo: "",
          name: "",
          operDate: "",
          operName: "",
          patRegNo: "",
          sex: "",
          tel: ""
        }
      ],
      startDateOptions: {
        disabledDate: date => {
          const endDate = this.form.endDate;
          return utils.compareDate(date, endDate);
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(new Date(date.getTime() - 3600 * 1000 * 24));
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      endDateOptions: {
        disabledDate: date => {
          const startDate = this.form.startDate;
          return utils.compareDate(startDate, date);
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "明天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.findBookPat();
  },
  computed: {
    getLocMethodStr() {
      return `Nur.CommonInterface.Loc:getLocs:E:`;
    },
    getWardMethodStr() {
      return `Nur.CommonInterface.Loc:getLocs:W:`;
    },
    getDoctorMethodStr() {
      const admLocID = this.form.bookLoc;
      return `Nur.CommonInterface.Ward:getMainDoctors:${admLocID}:`;
    }
  },
  methods: {
    init() {
      this.form.startDate = new Date(new Date().getTime() - 3600 * 1000 * 24);
      this.form.endDate = new Date(new Date().getTime() + 3600 * 1000 * 24);
    },
    mouseover() {
      this.$emit("mouseover");
    },
    findBookPat() {
      const {
        bookNo,
        regNo,
        startDate,
        endDate,
        patName,
        bookLoc,
        bookWard,
        bookDoctor
      } = this.form;
      const startDateStr = utils.formatDate(startDate);
      const endDateStr = utils.formatDate(endDate);
      const that = this;
      apointApi
        .findBookPat(
          bookNo,
          regNo,
          startDateStr,
          endDateStr,
          patName,
          bookLoc,
          bookWard,
          bookDoctor
        )
        .then(ret => {
          that.tableData = ret;
        });
    },
    onSearch() {
      this.findBookPat();
    },
    filterLoc(query) {
      const queryStr = query.toUpperCase();
      this.dialogLocs = this.$refs.locSelect.optionsData.filter(
        loc =>
          String(loc.desc).indexOf(queryStr) > -1 ||
          String(loc.code).indexOf(queryStr) > -1 ||
          pinyinUtil.getFirstLetter(loc.desc).indexOf(queryStr) > -1
      );
    },
    filterWard(query) {
      const queryStr = query.toUpperCase();
      this.dialogWards = this.$refs.wardSelect.optionsData.filter(
        ward =>
          String(ward.desc).indexOf(queryStr) > -1 ||
          String(ward.code).indexOf(queryStr) > -1 ||
          pinyinUtil.getFirstLetter(ward.desc).indexOf(queryStr) > -1
      );
    },
    rowDbClick(row) {
      this.$eventBus.$emit("pat-search-row-click", row);
    },
    completeReg() {
      utils.completeRegNo(this.form.regNo).then(regNo => {
        this.form.regNo = regNo;
      });
    },
    filterDoctor(query) {
      const queryStr = query.toUpperCase();
      this.bookDocs = this.$refs.docSelect.optionsData.filter(
        doc =>
          doc.name.indexOf(queryStr) > -1 ||
          pinyinUtil.getFirstLetter(doc.name).indexOf(queryStr) > -1
      );
    }
  },
  components: {
    YlSelect: Select,
    YlDatePicker: DatePicker
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../../assets/main.css";
@b patSearch {
  width: 1080px;
  @e input {
    width: 120px;
    display: block;
    line-height: 35px;
    & .el-input__inner {
      border: 1px solid var(--mainColor);
    }
  }
  @e dataPicker {
    width: 140px !important;
    display: block;
    line-height: 35px;
  }
  @e title {
    color: #fff;
    background-color: var(--mainColor);
    font-size: 16px;
    padding: 8px;
  }
  @e searchCondition {
    padding: 8px;
  }
  @e searchUl {
    display: block;
    position: relative;
    height: 85px;
    /* margin: 0 auto;*/
    /*width: 1000px;
    border-bottom: 1px solid #cccccc;*/
    text-align: center;
  }
  @e searchLi {
    float: left;
    height: 70px;
    padding: 5px;
    margin-right: 15px;
  }
  @e datePickerLabel {
    font-size: var(--mainFontSize);
    display: block;
    line-height: 35px;
  }
  @e searchBtn {
    margin: 15px;
    height: 36px;
    font-size: 16px;
    border-radius: 0;
  }
  @e splitLine {
    display: block;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
  }
}
</style>
