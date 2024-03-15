<template>
  <el-dialog
      title="新建项目"
      :visible.sync="showDialog"
      width="400px"
      :before-close="cancelDialog">
    <div class="selectItem">
      <div>项目类型</div>
      <el-select v-model="typeValue" placeholder="请选择" style="margin-left: 20px;width: 250px">
        <el-option
            v-for="item in type"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
    </div>

    <div class="selectItem" style="margin-top: 15px">
      <div>项目名称</div>
      <el-input placeholder="请输入项目名称" v-model="name" style="margin-left:20px; width: 250px;"/>
    </div>

    <div class="uploadItem" style="margin-top: 15px">
      <div>项目封面</div>
      <div class="avatar-uploader" style="margin-left: 20px;">
      <img :src=logo class="avatar" fit="cover"/>
      </div>
    </div>

    <div class="uploadItem" style="margin-top: 15px">
      <div style="display: flex; justify-content: flex-end;">
        <el-select v-model="logo" placeholder="选择封面" style="margin-left: 75px;">
          <el-option v-for="logoOption in logoOptions" :key="logoOption.url" :value="logoOption.url" :label="logoOption.name"></el-option>
        </el-select>
      </div>
    </div>

    <div class="uploadItem" style="margin-top: 15px">
      <FileUpload style="margin-left: 76px;" @onFileSuccess="onFileSuccess"/>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import FileUpload from "@/components/common/FileUpload";
import { logoOptions } from './logodata.js';

export default {
  name: "CreateDialog",
  components: { FileUpload },
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
          id: 1,
          name: '机器学习'
        },
        {
          id: 2,
          name: '博弈'
        },
        {
          id: 3,
          name: '聊天机器人'
        }
      ],
      typeValue: 1,
      name: '',
      logo: '',
      logoOptions: logoOptions
    }
  },

  created() {
    this.randomizeLogo();
  },

  methods: {

    randomizeLogo() {
      const randomIndex = Math.floor(Math.random() * this.logoOptions.length);
      this.logo = this.logoOptions[randomIndex].url;
    },

    ok() {
      let data = {
        type: this.typeValue,
        name: this.name,
        logo: this.logo.replace('/file/', '/')
      }
      if (!data.name) {
        this.$message.error("请输入项目名称")
        return;
      }
      this.$emit("ok",data)
    },
    cancelDialog() {
      this.$emit("cancel")
    },
    onFileSuccess(e) {
      this.logo = '/file' + e.data;
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