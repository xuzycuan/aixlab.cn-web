<template>
  <div class="card">
    <div class="cardInfo">
      <div class="cardName">{{ data.name }}</div>
      <div class="cardDate">{{ data.uploadDate }}</div>
    </div>
    <el-button class="cardDownloadBtn" icon="el-icon-download" circle size="small" type="warning" @click="downloadDocument"/>
    <el-button class="cardDeleteBtn" icon="el-icon-delete" circle size="small" type="danger" @click="deleteDocument"/>
  </div>
</template>

<script>

export default {
  name: "DocItem",
  props: {
    data: {
      type: Object,
      default: {}
    },
    index: {
      type: Number
    }
  },
  methods: {
    downloadDocument() {
      window.location.href = this.data.filePath
    },

    deleteDocument() {
      this.$emit("deleteDocument", this.data.id, this.index)
    }
  }
}
</script>

<style scoped>
.card {
  position: relative;
  margin-left: 15px;
  margin-right: 15px;
  margin-bottom: 5px;
  border-radius: 3px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 1px 0 #eee;
}

.cardDownloadBtn {
  position: absolute;
  right: 45px;
  top: 5px;
}

.cardDeleteBtn {
  position: absolute;
  right: 5px;
  top: 5px;
}

.cardImage {
  width: 100%;
  height: 230px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.cardInfo {
  position: relative;
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.cardName {
  font-weight: bold;
  font-size: 15px;
  margin-left: 15px;
  max-width: calc(100% - 130px);
}

.cardDate {
  color: #888;
  font-size: 14px;
  margin-left: 15px;
  max-width: calc(100% - 130px);
}

.cardBtn {
  position: absolute;
  right: 15px;
}
</style>