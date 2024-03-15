<template>
  <uploader
    :options="options"
    :file-status-text="fileStatusText"
    @file-added="onFileAdded"
    @file-success="onFileSuccess"
    @file-complete="onFileComplete"
    @complete="onComplete"
    ref="uper"
    class="multi-uploader-example">
    <uploader-unsupport></uploader-unsupport>
    <uploader-drop>
      <uploader-btn>选择文件</uploader-btn>
    </uploader-drop>
    <uploader-list></uploader-list>
    <div v-if="uploadProgress.total > 0">
      <div v-if="filesUploaded">
        全部上传完成，总文件数：{{ uploadProgress.total }}
      </div>
      <div v-else>
        上传进度：{{ uploadProgress.current }} / {{ uploadProgress.total }}
      </div>
    </div>
  </uploader>
</template>

<script>
export default {
  name: "MultiFileUpload",
  data () {
    return {
      options: {
        target: '/file/upload',
        testChunks: false,
        chunkSize: 1 * 1024 * 1024, // 1MB
        simultaneousUploads: 3,     // 并发上传数
        headers: {
          'Authorization': sessionStorage.getItem('token')
        },
      },
      attrs: {
        accept: 'image/*'
      },
      fileStatusText: {
        success: '成功',
        error: '失败',
        uploading: '上传中',
        paused: '暂停',
        waiting: '等待',
      },
      uploadProgress: {
        current: 0,
        total: 0,
      },
      filesUploaded: false,
    };
  },
  methods: {
    onFileAdded(file, event) {
      this.$emit("onFileAdded", file);

      this.uploadProgress.total += 1;
    },
    onFileSuccess(rootFile, file, response, chunk) {
      this.$emit("onFileSuccess", file, JSON.parse(response));

      this.uploadProgress.current += 1;

      if (this.uploadProgress.current === this.uploadProgress.total) {
        this.filesUploaded = true;
      }
    },
    onFileComplete(rootFile) {
      // this.$refs.uper.uploader.files = [ ];
      // this.$refs.uper.uploader.fileList = [ ];
    },
    onComplete() {
      this.$refs.uper.uploader.files = [];
      this.$refs.uper.uploader.fileList = [];

      this.filesUploaded = false;
    },
  },
};
</script>

<style scoped>
.multi-uploader-example {
  width: 70%;
}

.multi-uploader-example .uploader-btn {
  margin-right: 4px;
}

.multi-uploader-example .uploader-list {
  max-height: 50px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
