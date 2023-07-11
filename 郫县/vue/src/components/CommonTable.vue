
<script>
import axios from "axios";
import {
  runServerMethodStr,
  runServerMethod,
  queryBrokerCls,
  getQueryColumnsMethod
} from "../store/api/runServerMethod";

export default {
  name: "CommonTable",
  props: ["runServerMethodStr", "height"],
  data() {
    return {
      data: [],
      columns: []
    };
  },
  render() {
    return (
      <el-table
        data={this.data}
        border
        height={this.height}
        highlight-current-row
        style="width: 100%"
        onRow-click={this.rowClick}
        onRow-dblclick={this.rowDblclick}
      >
        {this.columns.map(column => {
          if (column.header !== "hidden") {
            return (
              <el-table-column
                prop={column.name}
                label={column.header}
                key={column.name}
                ref={column.name}
                // width={column.width}
                min-width="40"
                scopedSlots={{ default: this.$scopedSlots[column.name] }}
              />
            );
          }
          return "";
        })}
        {this.$slots.right}
      </el-table>
    );
  },
  beforeMount() {
    this.load();
  },
  watch: {
    runServerMethodStr() {
      this.reload();
    }
  },
  methods: {
    rowClick(row, event, column) {
      this.$emit("row-click", row, event, column);
    },
    rowDblclick(row, event) {
      this.$emit("row-dblclick", row, event);
    },
    reload() {
      this.load();
    },
    load() {
      const runServerMethodArray =
        this.runServerMethodStr !== ""
          ? this.runServerMethodStr.split(":")
          : [];
      if (runServerMethodArray.length > 1) {
        const cls = runServerMethodArray[0];
        const method = runServerMethodArray[1];
        let data;
        let columns;
        const promisGetData = runServerMethodStr(this.runServerMethodStr).then(
          json => {
            data = typeof json === "object" ? json : [];
          }
        );
        const promisGetColumns = runServerMethod(
          queryBrokerCls,
          getQueryColumnsMethod,
          cls,
          method
        ).then(json => {
          columns = typeof json === "object" ? json : [];
        });
        axios.all([promisGetData, promisGetColumns]).then(() => {
          this.data = data;
          this.columns = columns;
        });
      }
    }
  }
};
</script>
<style >
</style>
