<template>
  <div class="folderItem">
    <div class="folderInfo" @click="selectFolder">
      <div style="margin-left: 15px;" v-if="notBase">›</div>
      <div class="folderName">{{ data.name }}</div>
    </div>
    <el-button class="folderDeleteBtn" style="margin-top: 4px; padding: 4px;" v-if="notBase" icon="el-icon-delete" circle size="small" type="warning" @click="deleteFolder"/>
  </div>
</template>

<script>

export default {
  name: "DatasetFolderItem",
  props: {
    data: {
      type: Object,
      default: {}
    },
    index: {
      type: Number
    }
  },
  data() {
    return {
      notBase: true
    }
  },
  mounted() {
    this.notBase = (this.data.path !== '.');
  },
  methods: {
    selectFolder() {
      this.$message.success("已进入文件夹：" + this.data.name)
      this.$emit("selectFolder", this.index, this.data.path)
    },
    deleteFolder() {
      this.$emit("deleteFolder", this.index, this.data.path)
    }
  }
}
</script>

<style scoped>

.folderDeleteBtn {
  position: absolute;
  right: 5px;
  top: 5px;
}

.folderInfo {
  position: relative;
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.folderName {
  font-weight: bold;
  font-size: 15px;
  margin-left: 15px;
  max-width: calc(100% - 30px);
}

.folderDate {
  color: #888;
  font-size: 14px;
  margin-left: 15px;
  max-width: calc(100% - 30px);
}

.folderItem {
  position: relative;
  margin-bottom: 5px;
  border-radius: 3px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 1px 0 #eee;
  cursor: pointer;
}

.selected {
  background-color: mediumaquamarine;
}

</style>