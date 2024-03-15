<template>
  <el-dialog
      title="运行项目"
      :visible.sync="showDialog"
      width="450px"
      :before-close="cancelDialog">
    <div class="uploadItem" style="margin-top: 15px">
      <div style="display: flex;align-items: center;justify-content: center">运行数据集</div>
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
      <el-input :placeholder="typeName" size="medium" v-model="file" style="width: 300px; margin-left: 20px"/>
    </div>

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
  name: "RunDialog",
  components: {FileSelect, ImageSelect},
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 0
    }
  },

  mounted() {
    this.getDatasetsList();
  },
  computed:{
    typeName(){
       switch (this.type) {
         case 1:
           return "本地测试图片/音频文件路径";
         case 3:
           return "本地测试 CSV 文件路径";
         default:
           return "";
       }
     }
  },

  data() {
    return {
      file: '',
      datasetsId: '0',
      datasetsList: [{
        id: '0',
        name: '使用本地数据集'
      }]
    }
  },

  methods: {
    getDatasetsList() {
      getDatasetsListR(1, 2).then(data => {
        if (data.state === 100) {
          let records = data.data.records;
          this.datasetsList = this.datasetsList.concat(records)
          this.datasetsId = this.datasetsList.length > 0 ? this.datasetsList[1].id : 0;
        }
      }).catch(reason => {
      })
    },
    refreshDatasets() {
      getDatasetsListR(1, 2).then(data => {
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
        file: this.file,
        datasetsId: this.datasetsId
      }
      if (data.datasetsId == '0') {
        if (!data.file) {
          this.$message.error("请输入" + this.typeName)
          return;
        }
      }
      this.$emit("ok", data)
    },
    cancelDialog() {
      this.$emit("cancel")
    },

    onSelectFile(e) {
      this.file = e;
    },

  }
}
</script>

<style scoped>

.uploadItem {
  display: flex;
  flex-direction: row;
}

</style>