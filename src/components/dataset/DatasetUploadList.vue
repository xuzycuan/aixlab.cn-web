<template>
  <div class="uploadList">
    <DatasetUploadItem v-for="(item,index) in uploadedFiles" :key="index" :data="item" :index="index" @deleteFile="deleteFile"/>
    <div v-if="noMoreData" style="width: 100%; height:50px;">请上传数据文件~</div>
  </div>
</template>

<script>
import DatasetUploadItem from "@/components/dataset/DatasetUploadItem";

export default {
  name: "DatasetUploadList",
  components: { DatasetUploadItem },
  data() {
    return {
      noMoreData: true,
      uploadedFiles: []
    }
  },
  methods: {
    getFiles() {
      return this.uploadedFiles;
    },
    addFile(name, path) {
      for (var i = 0; i < this.uploadedFiles.length; i ++) {
        if (this.uploadedFiles[i].name == name) {
          return;
        }
      }

      this.uploadedFiles.push({ 'name': name, 'path': path });
      this.noMoreData = false;
    },
    deleteFile(path, index) {
      for (var i = 0; i < this.uploadedFiles.length; i ++) {
        if (this.uploadedFiles[i].path == path) {
          this.uploadedFiles.splice(i, 1); break;
        }
      }
      this.noMoreData = (this.uploadedFiles.length<=0);
    },
    reset() {
      this.uploadedFiles = [];
      this.noMoreData = true;
    }
  },
}
</script>

<style scoped>

.uploadList {
  width: 260px;
  height: 300px;
  max-height: 300px;
  overflow: scroll;
}

.uploadList::-webkit-scrollbar {
  display: none;
}

</style>