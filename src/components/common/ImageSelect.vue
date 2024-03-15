<template>
  <div class="avatar-uploader">
    <el-image v-if="imageUrl" :src="imageUrl" class="avatar" fit="cover"/>
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    <input type="file" id="fileSelect" class="avatar-uploader-select" @change="onSelectFile"/>
  </div>
</template>

<script>
export default {
  name: "ImageSelect",
  data(){
    return {
      imageUrl:''
    }
  },
  methods:{
    onSelectFile(){
      let select = document.getElementById("fileSelect");
      let file = select.files[0];
      this.imageUrl = URL.createObjectURL(file);
      this.$emit("onSelectFile",file)
    }
  }
}
</script>

<style scoped>

.avatar-uploader  {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-select{
  position: absolute;
  width: 100px;
  height: 100px;
  left: 0;
  top: 0;
  opacity: 0;
}

.avatar-uploader :hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

</style>