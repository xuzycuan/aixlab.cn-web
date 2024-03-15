<template>
  <div>
    <Title ref="AppTitle" />
    <div class="main">
      <!--   头部菜单   -->
      <div class="menu">
        <div>文档管理</div>

        <el-button class="uploadBtn" type="primary" size="small" @click="showUploadDialog=true">+ 上传新文档</el-button>
      </div>
      <!--   文档列表   -->
      <div class="docList" v-infinite-scroll="onDocumentLoadMore" :infinite-scroll-disabled="noMoreData" style="overflow: auto">
        <DocItem v-for="(item,index) in docList" :key="index" :data="item" :index="index" @deleteDocument="deleteDocument"/>
        <NoMoreData v-if="noMoreData"/>
      </div>
    </div>
    <DocUploadDialog :show-dialog="showUploadDialog" @cancel="showUploadDialog=false" @ok="createDocument"/>
  </div>
</template>

<script>
import Title from "@/components/common/Title";
import DocItem from "@/components/docs/DocItem";
import DocUploadDialog from "@/components/docs/DocUploadDialog";
import NoMoreData from "@/components/common/NoMoreData";
import { getDocList, createDoc, deleteDoc, pageSize } from "@/http/docRequest"

export default {
  name: "Docs",
  components: { NoMoreData, DocUploadDialog, DocItem, Title },
  data() {
    return {
      page: 1,
      docList: [],
      showUploadDialog: false,
      noMoreData: false,
    }
  },
  mounted() {
    this.$refs.AppTitle.switchTitle('文档管理');
    this.getDocumentList();
  },
  methods: {
    /**
     *  请求文档列表
     */
     getDocumentList() {
      this.noMoreData = false;
      getDocList(this.page).then(data => {
        if (data.state === 100) {
          if (this.page === 1) {
            this.docList = [];
          }
          let records = data.data.records;
          if (!records || records.length === 0) {
            this.noMoreData = true;
          }
          this.docList = this.docList.concat(records)
        }
      }).catch(reason => {
        
      })
    },

    onDocumentLoadMore() {
      if (this.docList.length >= pageSize) {
        this.page++;
        this.getDocumentList();
      }
    },

    createDocument(e) {
      this.showUploadDialog = false;
      createDoc(e).then(data => {
        if (data.state === 100) {
          this.page = 1;
          this.getDocumentList();
        }
      }).catch(reason => {

      })
    },

    deleteDocument(id, index) {
      this.$alertDialog("确定删除?").then(() => {
        deleteDoc(id).then(data => {
          if (data.state === 100) {
            this.docList.splice(index, 1);
          } else {
            this.$message.error("删除失败")
          }
        }).catch(reason => {

        })
      }).catch(() => {

      })
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

.uploadBtn {
  position: absolute;
  right: 0;
}

.docList {
  display: grid;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 15px;
  margin-right: 15px;
  overflow: scroll;
  max-height: calc(100vh - 150px);
}

.docList::-webkit-scrollbar {
  display: none;
}

</style>