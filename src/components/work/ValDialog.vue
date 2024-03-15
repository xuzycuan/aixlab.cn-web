<template>
  <el-dialog
      title="验证项目"
      :visible.sync="showDialog"
      width="450px"
      :before-close="cancelDialog">
    <div class="uploadItem" style="margin-top: 15px">
      <div style="display: flex;align-items: center;justify-content: center">验证数据集</div>
      <el-select class="typeSelect" v-model="datasetsId" style="width: 230px; margin-left: 20px;" size="medium">
        <el-option
            v-for="item in datasetsList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
      <el-button @click="refreshDatasets" size="medium">刷新</el-button>
    </div>

    <div class="uploadItem" style="margin-top: 15px">
      <!--el-checkbox size="medium" v-model="isLocal" style="margin-top: 6px;">本地数据集</el-checkbox-->
      <div style="display: flex; align-items: center; justify-content: center;">本地数据集</div>
      <el-input placeholder="本地验证数据集路径" size="medium" v-model="path" style="width: 300px; margin-left: 20px"/>
    </div>
      <!--div class="uploadItem" style="margin-top: 15px">
        <div style="display: flex;align-items: center;justify-content: center">验证集路径</div>
        <el-input size="medium" v-model="path" style="width: 230px;margin-left: 20px"/>
      </div-->
  
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </span>
  </el-dialog>
</template>
  
<script>
import ImageSelect from "@/components/common/ImageSelect";
import FileSelect from "@/components/common/FileSelect";
import { getDatasetsListR, pageSize } from "@/http/datasetsRequest"

export default {
  name: "ValDialog",
  components: {FileSelect, ImageSelect},
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      path: '',
      datasetsId: '0',
      datasetsList: [{
        id: '0',
        name: '使用本地数据集'
      }]
    }
  },

  mounted() {
    this.getDatasetsList();
  },
  
  methods: {
    getDatasetsList() {
      getDatasetsListR(1, 3).then(data => {
        if (data.state === 100) {
          let records = data.data.records;
          this.datasetsList = this.datasetsList.concat(records)
          this.datasetsId = this.datasetsList.length > 0 ? this.datasetsList[1].id : 0;
        }
      }).catch(reason => {
      })
    },
    refreshDatasets() {
      getDatasetsListR(1, 3).then(data => {
        if (data.state === 100) {
          let records = data.data.records;
          this.datasetsList = [{
            id: '0',
            name: '使用本地数据集'
          }];
          this.datasetsList = this.datasetsList.concat(records)
          this.datasetsId = this.datasetsList.length > 0 ? this.datasetsList[1].id : 0;
        }
      }).catch(reason => {
      })
    },
    ok() {
      let data = {
        path: this.path,
        datasetsId: this.datasetsId
      }
      if (data.datasetsId == '0') {
        if (!data.path) {
          this.$message.error("请输入本地验证数据集路径")
          return;
        }
      }
      this.$emit("ok",data)
    },
    cancelDialog() {
      this.$emit("cancel")
    }
  }
}
</script>
  
<style scoped>
  
.uploadItem {
  display: flex;
  flex-direction: row;
}
  
.typeSelect {
  width: 180px;
  margin-left: 20px;
}

</style>