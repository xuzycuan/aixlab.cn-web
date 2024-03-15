<template>
  <div>
    <Title ref="AppTitle" />
    <div class="main">
      <!--   头部菜单   -->
      <div class="menu">
        <div>数据集类别</div>
        <el-select class="typeSelect" v-model="typeValue" size="small" @change="typeValueChange">
          <el-option
              v-for="item in type"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>

        <el-button class="createBtn" type="primary" size="small" @click="showCreateDialog=true">+ 新建数据集</el-button>
      </div>
      <!--   文档列表   -->
      <div class="datasetsList" v-infinite-scroll="onDatasetsLoadMore" :infinite-scroll-disabled="noMoreData" style="overflow: auto">
        <DatasetsItem v-for="(item,index) in datasetsList" :key="index" :data="item" :index="index" @deleteDatasets="deleteDatasets"/>
        <NoMoreData v-if="noMoreData"/>
      </div>
    </div>
    <DatasetsCreateDialog :show-dialog="showCreateDialog" @cancel="showCreateDialog = false" @ok="createDatasets"/>
  </div>
</template>

<script>
import Title from "@/components/common/Title";
import DatasetsItem from "@/components/datasets/DatasetsItem";
import DatasetsCreateDialog from "@/components/datasets/DatasetsCreateDialog";
import NoMoreData from "@/components/common/NoMoreData";
import { getDatasetsListR, createDatasetsR, deleteDatasetsR, pageSize } from "@/http/datasetsRequest"

export default {
  name: "Datasets",
  components: { NoMoreData, DatasetsCreateDialog, DatasetsItem, Title },
  data() {
    return {
      type: [
        {
          id: 0,
          name: '全部'
        },
        {
          id: 1,
          name: '训练数据集'
        },
        {
          id: 2,
          name: '运行数据集'
        },
        {
          id: 3,
          name: '验证数据集'
        }
      ],
      typeValue: 0,
      page: 1,
      datasetsList: [],
      showCreateDialog: false,
      noMoreData: false
    }
  },
  mounted() {
    this.$refs.AppTitle.switchTitle('数据集管理');
    this.getDatasetsList();
  },
  methods: {
    /**
     *  请求项目列表
     */
     getDatasetsList() {
      this.noMoreData = false;
      getDatasetsListR(this.page, this.typeValue).then(data => {
        if (data.state === 100) {
          if (this.page === 1) {
            this.datasetsList = [];
          }
          let records = data.data.records;
          if (!records || records.length === 0) {
            this.noMoreData = true;
          }
          this.datasetsList = this.datasetsList.concat(records)
        }
      }).catch(reason => {
      })
    },

    onDatasetsLoadMore() {
      if (this.datasetsList.length >= pageSize) {
        this.page++;
        this.getDatasetsList();
      }
    },

    createDatasets(e) {
      this.showCreateDialog = false;
      createDatasetsR(e).then(data => {
        if (data.state === 100) {
          this.page = 1;
          this.getDatasetsList();
        }
      }).catch(reason => {
      })
    },

    deleteDatasets(id, index) {
      this.$alertDialog("确定删除?").then(() => {
        deleteDatasetsR(id).then(data => {
          if (data.state === 100) {
            this.datasetsList.splice(index, 1);
          } else {
            this.$message.error("删除失败")
          }
        }).catch(reason => {
        })
      }).catch(() => {
      })
    },

    typeValueChange(e) {
      this.page = 1;
      this.getDatasetsList()
    },
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

.typeSelect {
  width: 180px;
  margin-left: 20px;
}

.createBtn {
  position: absolute;
  right: 0;
}

.datasetsList {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 15px;
  margin-right: 15px;
  overflow: scroll;
  max-height: calc(100vh - 150px);
}

.datasetsList::-webkit-scrollbar {
  display: none;
}

</style>