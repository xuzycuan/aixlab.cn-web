<template>
  <div class="dsetFolderList">
    <DatasetFolderItem v-for="(item,index) in folderList" :key="index" :data="item" :index="index" @selectFolder="selectFolder" @deleteFolder="deleteFolder"/>
    <DatasetFolderItemPlus ref="plus" @addFolder="addFolder"/>
  </div>
</template>

<script>
import DatasetFolderItem from "@/components/dataset/DatasetFolderItem";
import DatasetFolderItemPlus from "@/components/dataset/DatasetFolderItemPlus";

export default {
  name: "DatasetFolderList",
  components: { DatasetFolderItem, DatasetFolderItemPlus },
  data() {
    return {
      folderList: []
    }
  },
  methods: {
    selectFolder(index, name){
      this.$emit("onFolderSelected", name);
    },
    deleteFolder(index, name){
      this.$emit("onFolderDeleted", name);
    },
    removeFolder(name){
      this.folderList.splice(this.folderList.indexOf(name), 1);
    },
    addFolder(name){
      for (var i = 0; i < this.folderList.length; i ++) {
        if (this.folderList[i].path === name) {
          this.$message.error("文件夹已存在！")
          return false;
        }
      }
      this.folderList.push({ 'name': name, path: name });
      this.sortFolderList();
      this.$refs.plus.reset();
    },
    setFolderList(folderList){
      this.folderList = folderList;
      this.sortFolderList();
    },
    sortFolderList() {
      var list = [];
      var base = null;

      for (var i = 0; i < this.folderList.length; i ++) {
        if (this.folderList[i].path == '.') {
          base = this.folderList[i];
          continue;
        }
        list.push(this.folderList[i])
      }
      list.sort(function(a, b){ return a.path.localeCompare(b.path); });

      if (base) list.unshift(base);

      this.folderList = list;
    }
  },
}
</script>

<style scoped>

.dsetFolderList {
  overflow: scroll;
  max-height: 300px;
  width: 260px;
}

.dsetFolderList::-webkit-scrollbar {
  display: none;
}

</style>