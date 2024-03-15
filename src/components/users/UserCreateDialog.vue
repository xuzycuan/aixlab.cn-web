<template>
  <el-dialog
      title="创建新用户"
      :visible.sync="showDialog"
      width="500px"
      :before-close="cancelDialog">
      <div class="selectItem">
      <div>用户的类型</div>
      <el-select v-model="userType" placeholder="请选择" style="margin-left: 20px;width: 250px">
        <el-option
            v-for="item in type"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
    </div>

    <div class="selectItem" style="margin-top: 15px">
      <div>用户名前缀</div>
      <el-input placeholder="请输入用户名前缀，如：student_" v-model="prefix" style="margin-left: 20px; width: 360px;"/>
    </div>

    <div class="selectItem" style="margin-top: 15px">
      <div>用户起始号</div>
      <el-input placeholder="请输入用户起始号，如：1" v-model="startNo" style="margin-left: 20px; width: 360px;"/>
    </div>

    <div class="selectItem" style="margin-top: 15px">
      <div>生成用户数</div>
      <el-input placeholder="请输入生成用户数，如：10" v-model="count" style="margin-left: 20px; width: 360px;"/>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "UserCreateDialog",
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      type: [
        {
          id: 0,
          name: '学生'
        },
        {
          id: 1,
          name: '教师'
        }
      ],
      userType: 0,
      prefix: 'student_',
      startNo: 1,
      count: 10
    }
  },
  methods: {
    ok() {
      let data = {
        userType: this.userType,
        prefix: this.prefix,
        startNo: this.startNo,
        count: this.count
      }
      if (!data.prefix) {
        this.$message.error("请输入用户名前缀")
        return;
      }
      if (!data.startNo) {
        this.$message.error("请输入用户起始号")
        return;
      }
      if (!data.count) {
        this.$message.error("请输入生成用户数")
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