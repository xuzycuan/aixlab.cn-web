<template>
<uploader
  :options="options"
  :file-status-text="fileStatusText"
  @file-added="onFileAdded"
  @file-success="onFileSuccess"
  @file-complete="onFileComplete"
  @complete="onComplete"
  ref="uper"
  class="uploader-example">
  <uploader-unsupport></uploader-unsupport>
  <uploader-drop>
    <!--p>Drop files here to upload or</p-->
    <uploader-btn>选择文件</uploader-btn>
    <!--uploader-btn :attrs="attrs">select images</uploader-btn>
    <uploader-btn :directory="true">select folder</uploader-btn-->
  </uploader-drop>
  <uploader-list></uploader-list>
</uploader>
</template>

<script>
export default {
  name: "FileUpload",
  data () {
    return {
      options: {
        target: '/file/upload',
        singleFile: true,
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
        waiting: '等待'
      },
    }
  },
  methods: {
    onFileAdded(file, event) {
      this.$emit("onFileAdded", file)
    },
    onFileSuccess(rootFile, file, response, chunk) {
      this.$emit("onFileSuccess", JSON.parse(response))
    },
    onFileComplete(rootFile) {
      this.$refs.uper.uploader.files = [ ];
      this.$refs.uper.uploader.fileList = [ ];
    },
    onComplete() {
//      this.removeFile();
    }
  }
}
</script>

<style scoped>

.uploader-example {
  width: 70%;
}

.uploader-example .uploader-btn {
  margin-right: 4px;
}

.uploader-example .uploader-list {
  max-height: 50px;
  overflow-x: hidden;
  overflow-y: auto;
}

</style>