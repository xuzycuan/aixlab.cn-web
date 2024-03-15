<template>
  <div>
    <Title ref="AppTitle" />
    <div class="main">
      <!--   头部菜单   -->
      <div class="menu">
        <div>积木类别</div>
        <el-select class="typeSelect" v-model="typeValue" size="small" @change="typeValueChange">
          <el-option
              v-for="item in type"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>

        <div style="margin-left: 30px">积木模块</div>
        <el-select class="typeSelect" v-model="modelValue" size="small" @change="modelValueChange">
          <el-option
              v-for="item in model"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
        <el-button class="createBtn" type="primary" size="small" @click="showCreateDialog=true">+ 新建项目</el-button>
      </div>
      <!--   项目列表   -->
      <div class="workList" v-infinite-scroll="onWorkLoadMore" :infinite-scroll-disabled="noMoreData"
           style="overflow:auto">
        <WorkItem v-for="(item,index) in workList" :key="index" :data="item" :index="index" @deleteProject="deleteProject"/>
        <NoMoreData v-if="noMoreData"/>
      </div>
    </div>
    <CreateDialog :show-dialog="showCreateDialog" @cancel="showCreateDialog = false" @ok="createProject" ref="createDialogRef"/>
  </div>
</template>

<script>
import Title from "@/components/common/Title";
import WorkItem from "@/components/home/WorkItem";
import {setTunnelToUser, getFilterList, getProjectList, projectCreate, projectDelete, pageSize} from "@/http/homeRequest"
import CreateDialog from "@/components/home/CreateDialog";
import NoMoreData from "@/components/common/NoMoreData";
import { logoOptions } from './logodata.js';

export default {
  name: "Home",
  components: {NoMoreData, CreateDialog, WorkItem, Title},
  data() {
    return {
      type: [],
      typeValue: 0,
      model: [],
      modelValue: 0,
      page: 1,
      workList: [],
      showCreateDialog: false,
      noMoreData: false,
      logoOptions: logoOptions
    }
  },

  mounted() {
    this.$refs.AppTitle.switchTitle('项目管理');
    this.getFilter();
    this.getProject();
    this.userLogined();
  },
  methods: {
    userLogined() {
      let username = this.$store.getters.username;
      setTunnelToUser(username, response => {
        this.$message({
          message: '连接成功！',
          type: 'success'
        });
      },() => {
        this.$message.error('客户端未连接！');
      })
    },

    /**
     *  请求筛选数据
     */
    getFilter() {
      getFilterList().then(data => {
        if (data.state === 100) {
          let res = data.data;
          this.getTypeList(res)
        }
      }).catch(reason => {

      })
    },

    /**
     *  请求项目列表
     */
    getProject() {
      this.noMoreData = false;
      getProjectList(this.page, this.typeValue, this.modelValue).then(data => {
        if (data.state === 100) {
          if (this.page === 1) {
            this.workList = [];
          }
          let records = data.data.records;
          if (!records || records.length === 0) {
            this.noMoreData = true;
          }
          this.workList = this.workList.concat(records)
        }
      }).catch(reason => {
      })
    },

    onWorkLoadMore() {
      if (this.workList.length >= pageSize) {
        this.page++;
        this.getProject();
      }
    },

    createProject(e) {
      //重置数据
      const createDialogInstance = this.$refs.createDialogRef;
      const randomIndex = Math.floor(Math.random() * this.logoOptions.length);
      if (createDialogInstance) {
        createDialogInstance.logo = this.logoOptions[randomIndex].url; 
        createDialogInstance.name = '';
      }
      this.showCreateDialog = false;
      projectCreate(e).then(data => {
        if (data.state === 100) {
          this.page = 1;
          this.typeValue = 0;
          this.modelValue = 0;
          this.getProject();
        }
      }).catch(reason => {
      })
    },

    deleteProject(id, index) {
      this.$alertDialog("确定删除?").then(() => {
        projectDelete(id).then(data => {
          if (data.state === 100) {
            this.workList.splice(index, 1);
          } else {
            this.$message.error("删除失败")
          }
        }).catch(reason => {
        })
      }).catch(() => {
      })
    },

    /**
     *  筛选
     */
    typeValueChange(e) {
      this.resetModel();
      let typeItem = this.getTypeItem(e)
      if (typeItem != null) {
        let children = typeItem.children;
        if (children) {
          for (let index = 0; index < children.length; index++) {
            this.model.push({
              id: children[index].id,
              name: children[index].name
            })
          }
        }
      }
      this.page = 1;
      this.getProject()
    },

    modelValueChange() {
      this.page = 1;
      this.getProject()
    },

    /**
     *  组装筛选数据
     */
    getTypeList(res) {
      this.resetType();
      this.resetModel();
      for (let index = 0; index < res.length; index++) {
        this.type.push({
          id: res[index].id,
          name: res[index].name,
          children: res[index].children
        })
      }
    },

    getTypeItem(id) {
      for (let index = 0; index < this.type.length; index++) {
        let typeItem = this.type[index];
        if (typeItem.id === id) {
          return typeItem;
        }
      }
      return null;
    },

    resetType() {
      this.type = [];
      this.type.push({
        id: 0,
        name: '全部'
      });
      this.typeValue = 0;
    },

    resetModel() {
      this.model = [];
      this.model.push({
        id: 0,
        name: '全部'
      });
      this.modelValue = 0;
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

.typeSelect {
  width: 180px;
  margin-left: 20px;
}

.createBtn {
  position: absolute;
  right: 0;
}

.workList {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 15px;
  margin-right: 15px;
  overflow: scroll;
  max-height: calc(100vh - 150px);
}

.workList::-webkit-scrollbar {
  display: none;
}

</style>