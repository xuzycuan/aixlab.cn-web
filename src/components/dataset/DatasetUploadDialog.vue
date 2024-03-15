<template>
  <el-dialog
      title="上传新数据"
      :visible.sync="showDialog"
      width="500px"
      :before-close="cancelDialog">
    <!--div class="selectItem" style="margin-top: 15px">
      <div>数据名称</div>
      <el-input placeholder="请输入数据名称" v-model="name" style="margin-left: 20px; width: 360px;"/>
    </div-->

    <div class="selectItem" style="margin-top: 15px">
      <div>数据文件</div>
      <!--el-input placeholder="请选择上传的数据文件" v-model="file" style="margin-left: 20px; width: 360px;" readonly/-->
      <DatasetUploadList ref="uplist" style="margin-left: 20px; padding: 8px; width: 342px; border: 1px solid #d9d9d9;"/>
    </div>

    <div class="uploadItem" style="margin-top: 15px">
      <MultiFileUpload ref="UploadRef" style="margin-left: 76px; width: 78%;" @onFileSuccess="onFileSuccess" @onFileAdded="onFileAdded"/>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import DatasetUploadList from "@/components/dataset/DatasetUploadList";
import MultiFileUpload from "@/components/common/MultiFileUpload";

export default {
  name: "DatasetUploadDialog",
  components: { DatasetUploadList, MultiFileUpload },
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
      const createDialogInstance = this.$refs.UploadRef;
      if (createDialogInstance) {
        createDialogInstance.uploadProgress.current=0;
        createDialogInstance.uploadProgress.total=0;
      }
      var files = this.$refs.uplist.getFiles();

      if (!files.length) {
        this.$message.error("请选择要上传的数据文件")
        return;
      }

      this.$emit("ok",files);
      this.$refs.uplist.reset();
    },
    _ok() {
      let data = {
        name: this.name,
        file: this.file
      }
      if (!data.name) {
        this.$message.error("请输入数据名称")
        return;
      }
      if (!data.file) {
        this.$message.error("请选择要上传的数据文件")
        return;
      }
      this.$emit("ok",data)
    },
    cancelDialog() {
      this.$emit("cancel")
      this.$refs.uplist.reset();
      const createDialogInstance = this.$refs.UploadRef;
      if (createDialogInstance) {
        createDialogInstance.uploadProgress.current=0;
        createDialogInstance.uploadProgress.total=0;
      }
    },
    onFileAdded(e){
//      if (this.name !== e.name) {
//        this.name = e.name;
//      }
    },
    onFileSuccess(f, e) {
      this.$refs.uplist.addFile(f.name, e.data);
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

.avatar-uploader  {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}

.avatar {
  width: 100px;
  height: 84px;
  display: block;
}

</style>