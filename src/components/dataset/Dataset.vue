<template>
  <div>
    <Title ref="AppTitle" :can-back="true" />
    <div class="main">
      <!--   头部菜单   -->
      <div class="menu">
        <div>数据集管理</div>

        <el-button class="createBtn" type="primary" size="small" @click="showCreateDialog=true">+ 上传新数据</el-button>
        <el-button class="uploadBtn" type="primary" size="small" @click="showUploadDialog=true">+ 上传文件夹</el-button>
      </div>
      <div style="display: flex;">
      <!--   文件夹列表   -->
      <div class="folderList" style="overflow: auto">
        <DatasetFolderList ref="folder" @onFolderSelected="onFolderSelected" @onFolderDeleted="onFolderDeleted"/>
      </div>
      <!--   数据列表   -->
      <div class="datasetList" v-infinite-scroll="onDatasetLoadMore" :infinite-scroll-disabled="noMoreData" style="overflow: auto">
        <DatasetItem v-for="(item,index) in datasetList" :key="index" :data="item" :index="index" @deleteDataset="deleteDataset"/>
        <NoMoreData v-if="noMoreData"/>
      </div>
      </div>
    </div>
    <DatasetUploadDialog :show-dialog="showCreateDialog" @cancel="showCreateDialog = false" @ok="createDataset"/>
    <DirectoryUploadDialog :show-dialog="showUploadDialog" @cancel="showUploadDialog = false" @ok="uploadDataset"/>
  </div>
</template>

<script>
import Title from "@/components/common/Title";
import DatasetItem from "@/components/dataset/DatasetItem";
import DatasetFolderList from "@/components/dataset/DatasetFolderList";
import DatasetUploadDialog from "@/components/dataset/DatasetUploadDialog";
import DirectoryUploadDialog from "@/components/dataset/DirectoryUploadDialog";
import NoMoreData from "@/components/common/NoMoreData";
import { getDatasetAllR, getDatasetListR, createDatasetR, deleteDatasetR, deleteFolderR, pageSize } from "@/http/datasetRequest"

export default {
  name: "Dataset",
  components: { NoMoreData, DatasetUploadDialog, DirectoryUploadDialog, DatasetFolderList, DatasetItem, Title },
  data() {
    return {
      id: '',
      dt: '',
      datasetList: [],
      datasetAll: [],
      folder: '.',
      showCreateDialog: false,
      showUploadDialog: false,
      noMoreData: false
    }
  },
  mounted() {
    this.id = this.$route.query.id;
    this.dt = this.$route.query.dt;
    this.$refs.AppTitle.switchTitle('数据集管理');
    this.getDatasetAll();
  },
  methods: {
    /**
     *  请求项目列表
     */
     getDatasetAll() {
      this.noMoreData = false;
      getDatasetAllR(this.id).then(data => {
        if (data.state === 100) {
          this.datasetAll = [].concat(data.data);
          this.prepareDataset();
          this.changeDataset();
        }
      }).catch(reason => {
      })
    },

    prepareDataset() {
      var tmp = { ".": 1 };

      for (var i = 0; i < this.datasetAll.length; i ++) {
        var dataset = this.datasetAll[i];

        if (tmp[dataset.folder] === undefined) {
          tmp[dataset.folder] = 1;

        } else {
          tmp[dataset.folder] += 1;
        }
      }

      var names = Object.keys(tmp);
      var folders = [];
      var baseName = '';

      switch(this.dt) {
        case '1': baseName = '训练数据'; break;
        case '2': baseName = '运行数据'; break;
        case '3': baseName = '验证数据'; break;
        default: break;
      }

      folders.push({
        name: baseName,
        path: '.'
      });

      for (var i = 0; i < names.length; i ++) {
        if (names[i] == '.') continue;

        folders.push({
          name: names[i],
          path: names[i]
        });
      }

      this.$refs.folder.setFolderList(folders);
    },

    changeDataset() {
      this.datasetList = [];

      for (var i = 0; i < this.datasetAll.length; i ++) {
        var dataset = this.datasetAll[i];

        if (dataset.folder === this.folder) {
          this.datasetList.push(dataset)
        }
      }

      this.noMoreData = (this.datasetList.length <= 0);
    },

    onDatasetLoadMore() {
      //
    },

    createDataset(e) {
      this.showCreateDialog = false;
      let load = this.$loading({
        lock: true,
        text: "处理中",
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
        customClass: 'custom-loading'
      });
      var data = {
        datasetsId: this.id,
        folder: this.folder,
        name: '',
        file: ''
      };
      var count = e.length;
      var success = 0;
      var vm = this;

      function createDatasetsRecursive(index) {
        if (index >= count) {
          console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
          if(load){
            load.close()
            load = null;
          }
          vm.$message.success("已成功上传"+success+"张图片")
          vm.getDatasetAll(); 
          return;
        }

        data.name = e[index].name;
        data.file = e[index].path;

        createDatasetR(data).then(data => {
            if (data.state === 100) {
              success += 1;

              if (success >= count) {
                if(load){
                  load.close()
                  load = null;
                }
                vm.$message.success("已成功上传"+success+"张图片")
                vm.getDatasetAll(); 
                return;
              }
            }

            createDatasetsRecursive(index + 1);
          })
          .catch(reason => {
            count -= 1;
            createDatasetsRecursive(index + 1);
          });
      }

      createDatasetsRecursive(0);

    },

    uploadDataset(e) {
      this.showUploadDialog = false;

      var data = {
        datasetsId: this.id,
        folder: this.folder,
        name: '',
        file: ''
      }
      var count = e.length;
      var success = 0;

      for (var i = 0; i < count; i ++) {
        data.name = e[i].name;
        data.file = e[i].path;

        createDatasetR(data).then(data => {
          if (data.state === 100) {
            success += 1;

            if (success >= count) {
              this.getDatasetAll();
            }
          }

        }).catch(reason => {
          count -= 1;
        })
      }
    },

    deleteDataset(id, index) {
      this.$alertDialog("确定删除?").then(() => {
        deleteDatasetR(id).then(data => {
          if (data.state === 100) {
            this.getDatasetAll();
          } else {
            this.$message.error("删除失败")
          }
        }).catch(reason => {
        })
      }).catch(() => {
      })
    },

    onFolderDeleted(e) {
      var hasData = false;

      for (var i = 0; i < this.datasetAll.length; i ++) {
        var dataset = this.datasetAll[i];

        if (dataset.folder === e) {
          hasData = true; break;
        }
      }

      if (hasData) {
        this.$alertDialog("确定删除?").then(() => {
          deleteFolderR(this.id, e).then(data => {
            if (data.state === 100) {
              this.folder = '.';
              this.getDatasetAll();
            } else {
              this.$message.error("删除失败")
            }
          }).catch(reason => {
          })
        }).catch(() => {
        })

      } else {
        this.$refs.folder.removeFolder(e);
      }
    },

    onFolderSelected(e) {
      this.folder = e;
      this.changeDataset();
    }
  },
}
</script>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
}

.menu {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 13px;
  margin-left: 30px;
  margin-right: 30px;
  height: 80px;
}

.createBtn {
  position: absolute;
  right: 120px;
}

.uploadBtn {
  position: absolute;
  right: 0;
}

.folderList {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 15px;
  margin-right: 15px;
  overflow: scroll;
  max-height: calc(100vh - 150px);
  width: 260px;
}

.folderList::-webkit-scrollbar {
  display: none;
}

.datasetList {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 15px;
  margin-right: 15px;
  overflow: scroll;
  max-height: calc(100vh - 150px);
  width: calc(100% - 260px);
}

.datasetList::-webkit-scrollbar {
  display: none;
}

</style>