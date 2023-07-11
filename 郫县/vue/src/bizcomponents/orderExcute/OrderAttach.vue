<template>
  <div class="orderAttach">
    <el-radio-group v-model="typeRadio" @change="typeRadioChange">
      <el-radio label="10">首次</el-radio>
      <el-radio label="11">接瓶</el-radio>
    </el-radio-group>
    <div class="orderAttach__orders">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
      >全选</el-checkbox>
      <el-checkbox-group
        v-model="checkedAttachOrders"
        :min="0"
        @change="handleCheckedAttachOrdersChange"
      >
        <li class="orderAttach__checkBox" v-for="(attachOrder,index) of attachOrders" :key="index">
          <el-checkbox
            :label="attachOrder.ArcimId"
            :key="attachOrder.ArcimId"
          >{{attachOrder.ArcimDesc}}</el-checkbox>
        </li>
      </el-checkbox-group>
    </div>
    <span class="orderAttach__line"></span>
    <span class="orderAttach__footcontent">是否确认绑定?</span>
    <span class="orderAttach__footcontent">
      <common-button
        width="70"
        color="#ffffff"
        border="#509de1"
        background-color="#509de1"
        @click="attachOrderClick"
      >绑定</common-button>
      <span style="width:80px;display:inline-block"></span>
      <common-button
        width="70"
        color="#ffffff"
        border="#509de1"
        background-color="#509de1"
        @click="closeDialog"
      >取消</common-button>
    </span>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import CommonButton from "../../components/CommonButton";
import ordereApi from "../../store/api/order";
import ordereHandleApi from "../../store/api/orderHandle";
import session from "../../store/api/session";

export default {
  props: ["order", "ifShow", "defaultAttachTypeRadio"],
  components: {
    CommonButton
  },
  data() {
    return {
      typeRadio: "10",
      attachOrders: [],
      checkedAttachOrders: [],
      checkAll: false,
      isIndeterminate: false
    };
  },
  created() {
    this.getAttachOrders(this.defaultAttachTypeRadio);
  },
  watch: {
    attachOrders() {
      this.attachOrders.forEach(attachOrder => {
        this.checkedAttachOrders.push(attachOrder.ArcimId);
      });
    },
    ifShow(val) {
      if (val) {
        this.getAttachOrders(this.typeRadio);
      } else {
        this.checkedAttachOrders = [];
        this.typeRadio = "10";
        this.attachOrders = [];
        this.checkedAttachOrders = [];
      }
    },
    defaultAttachTypeRadio(val) {
      if (val) {
        this.typeRadio = val;
        this.getAttachOrders(this.typeRadio);
      }
    }
  },
  methods: {
    ...mapMutations(["requestQuery"]),
    getAttachOrders(type) {
      ordereApi.getAttachOrder(this.order.ID, type).then(ret => {
        this.attachOrders = ret;
        if (this.attachOrders.length > 0) {
          this.checkAll = true;
        }
      });
    },
    typeRadioChange() {
      this.attachOrders = [];
      this.checkedAttachOrders = [];
      this.getAttachOrders(this.typeRadio);
    },
    handleCheckAllChange(val) {
      if (val) {
        this.attachOrders.forEach(attachOrder => {
          this.checkedAttachOrders.push(attachOrder.ArcimId);
        });
      } else {
        this.checkedAttachOrders = [];
      }
      this.isIndeterminate = false;
    },
    handleCheckedAttachOrdersChange(value) {
      const checkedCount = value.length;
      this.checkAll =
        checkedCount > 0 && checkedCount === this.checkedAttachOrders.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.attachOrders.length;
    },
    closeDialog() {
      this.attachOrders = [];
      this.checkedAttachOrders = [];
      this.$emit("close");
    },
    attachOrderClick() {
      const userId = session.USER.USERID;
      const execLoc = session.USER.CTLOCID;
      const OereIDs = [];
      this.order.execInfos.forEach(execInfo => {
        if (execInfo.check) {
          OereIDs.push(execInfo.ID);
        }
      });
      const ArcimIds = [];
      const ArcimDescs = [];
      const Qtys = [];
      const ByHands = [];
      const ExecTypes = [];
      const NotLinkPriorStrs = [];
      const SingleNotFees = [];
      const StartNums = [];
      const EndNums = [];
      const AppendOrdTypes = [];
      const attachOrders = this.attachOrders;
      this.checkedAttachOrders.forEach(chceckedArcim => {
        const attachOrder = attachOrders.find(
          element => element.ArcimId === chceckedArcim
        );
        ArcimIds.push(attachOrder.ArcimId);
        ArcimDescs.push(attachOrder.ArcimDesc);
        Qtys.push(attachOrder.Qty);
        ByHands.push(attachOrder.ByHand);
        ExecTypes.push(attachOrder.ExecType);
        NotLinkPriorStrs.push(attachOrder.NotLinkPriorStr);
        SingleNotFees.push(attachOrder.SingleNotFee);
        StartNums.push(attachOrder.StartNum);
        EndNums.push(attachOrder.EndNum);
        AppendOrdTypes.push(attachOrder.AppendOrdType);
      });
      ordereHandleApi
        .runServerMethodFactory(
          "execAttachAricm",
          userId,
          execLoc,
          OereIDs.join("$"),
          ArcimIds.join("$"),
          Qtys.join("$"),
          ByHands.join("$"),
          ExecTypes.join("$"),
          NotLinkPriorStrs.join("$"),
          SingleNotFees.join("$"),
          StartNums.join("$"),
          EndNums.join("$"),
          AppendOrdTypes.join("$")
        )
        .then(ret => {
          if (String(ret) === "0") {
            this.$message({
              message: "绑定用法医嘱成功!",
              type: "success",
              showClose: true
            });
            this.$emit("close");
            this.requestQuery();
          } else {
            this.$message({
              message: `${ret}`,
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
    }
  }
};
</script>

<style>
@import "../../assets/main.css";
@b orderAttach {
  @e footcontent {
    display: block;
    text-align: center;
    color: black;
    font-size: var(--navFontSize);
  }
  @e line {
    display: block;
    height: 0;
    border-bottom: 1px dashed #556983;
    margin: 38px 15px;
  }
  @e orders {
    width: 100%;
  }
}
</style>


