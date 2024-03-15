<template>
  <el-dialog
      title="新建设备"
      :visible.sync="showDialog"
      width="400px"
      :before-close="cancelDialog">
    <div class="selectItem" style="margin-top: 15px">
      <div>设备名称</div>
      <el-input placeholder="请输入设备名称" v-model="name" style="margin-left:20px; width: 250px;"/>
    </div>

    <div class="selectItem" style="margin-top: 15px">
      <div>设备 SN</div>
      <el-input placeholder="请输入设备 SN" v-model="sn" style="margin-left:20px; width: 250px;"/>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "DeviceCreateDialog",
  components: { },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      name: '',
      sn: ''
    }
  },
  methods: {
    ok() {
      let data = {
        name: this.name,
        sn: this.sn,
      }
      if (!data.name) {
        this.$message.error("请输入设备名称")
        return;
      }
      if (!data.sn) {
        this.$message.error("请输入设备 SN")
        return;
      }
      this.$emit("ok",data)
    },
    cancelDialog() {
      this.$emit("cancel")
    }
  }
}
</script>

<style scoped>

.selectItem {
  display: flex;
  flex-direction: row;
  align-items: center;
}

</style>