<template>
  <el-dialog
      title="新建课程"
      :visible.sync="showDialog"
      width="400px"
      :before-close="cancelDialog">
    <div class="selectItem" style="margin-top: 15px">
      <div>课程名称</div>
      <el-input placeholder="请输入课程名称" v-model="name" style="margin-left:20px;width: 250px;"/>
    </div>

    <div class="uploadItem" style="margin-top: 15px">
      <div>课程封面</div>
      <div class="avatar-uploader" style="margin-left: 20px;">
      <img :src=cover class="avatar" fit="cover"/>
      </div>
    </div>

    <div class="uploadItem" style="margin-top: 15px">
      <FileUpload style="margin-left: 76px" @onFileSuccess="onFileSuccess"/>
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
  name: "CourseCreateDialog",
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
      cover: '/images/course.png'
    }
  },

  methods: {
    ok() {
      let data = {
        name: this.name,
        cover: this.cover.replace('/file/', '/')
      }
      if (!data.name) {
        this.$message.error("请输入课程名称")
        return;
      }
      this.$emit("ok",data)
    },
    cancelDialog() {
      this.$emit("cancel")
    },
    onFileSuccess(e) {
      this.cover = '/file' + e.data;
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