<template>
  <div class="fileSelect">
    <div class="fileSelectName singleLine"
    >{{ fileName }}
    </div>
    <div class="selectBtn" style="margin-left: 20px">
      <el-button type="primary" size="small">选择</el-button>
      <input type="file" id="fileSelect" class="fileSelectInput" @change="onSelectFile"/>
    </div>

  </div>
</template>

<script>
export default {
  name: "fileSelect",
  data() {
    return {
      fileName: '',
    }
  },
  methods: {
    onSelectFile() {
      let select = document.getElementById("fileSelect");
      let file = select.files[0];
      this.fileName = file.name;
      this.$emit("onSelectFile", file)
    }
  }
}
</script>

<style scoped>

.fileSelect {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.fileSelectName {
  width: 150px;
  height: 35px;
  border: 1px solid #5274D7;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;

}

.selectBtn {
  position: relative;
}

.fileSelectInput {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  opacity: 0;
}

</style>