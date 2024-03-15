<template>
  <el-dialog
      title="上传新课件"
      :visible.sync="showDialog"
      width="500px"
      :before-close="cancelDialog">
    <div class="selectItem" style="margin-top: 15px">
      <div>课件名称</div>
      <el-input placeholder="请输入课件名称" v-model="name" style="margin-left: 20px; width: 360px;"/>
    </div>

    <div class="selectItem" style="margin-top: 15px">
      <div>课件路径</div>
      <el-input placeholder="请选择上传课件" v-model="file" style="margin-left: 20px; width: 360px;" readonly/>
    </div>

    <div class="uploadItem" style="margin-top: 15px">
      <FileUpload style="margin-left: 76px; width: 78%;" @onFileSuccess="onFileSuccess"/>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import FileUpload from "@/components/common/FileUpload";

export default {
  name: "CoursewareUploadDialog",
  components: { FileUpload },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      name: '',
      file: ''
    }
  },
  methods: {
    ok() {
      let data = {
        name: this.name,
        file: this.file
      }
      if (!data.name) {
        this.$message.error("请输入课件名称")
        return;
      }
      if (!data.file) {
        this.$message.error("请选择要上传的课件")
        return;
      }
      this.$emit("ok",data)
    },
    cancelDialog() {
      this.$emit("cancel")
    },
    onFileSuccess(e) {
      this.file = e.data;
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

.uploadItem {
  display: flex;
  flex-direction: row;
}

</style>