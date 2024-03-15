<template>
  <div>
    <Title ref="AppTitle" />
    <div class="main">
      <!--   头部菜单   -->
      <div class="menu">
        <div>用户管理</div>

        <el-button class="uploadBtn" type="primary" size="small" @click="showCreateDialog=true">+ 创建新用户</el-button>
      </div>
      <!--   用户列表   -->
      <div class="userList" v-infinite-scroll="onUserLoadMore" :infinite-scroll-disabled="noMoreData" style="overflow: auto">
        <UserItem v-for="(item,index) in userList" :key="index" :data="item" :index="index" @deleteUser="onDeleteUser"/>
        <NoMoreData v-if="noMoreData"/>
      </div>
    </div>
    <UserCreateDialog :show-dialog="showCreateDialog" @cancel="showCreateDialog=false" @ok="onBatchCreateUser"/>
  </div>
</template>

<script>
import Title from "@/components/common/Title";
import UserItem from "@/components/users/UserItem";
import UserCreateDialog from "@/components/users/UserCreateDialog";
import NoMoreData from "@/components/common/NoMoreData";
import { getUserList, batchCreateUser, deleteUser, pageSize } from "@/http/userRequest"

export default {
  name: "Users",
  components: { NoMoreData, UserCreateDialog, UserItem, Title },
  data() {
    return {
      page: 1,
      userList: [],
      showCreateDialog: false,
      noMoreData: false,
    }
  },
  mounted() {
    this.$refs.AppTitle.switchTitle('用户管理');
    this.getUsersList();
  },
  methods: {
    /**
     *  请求文档列表
     */
     getUsersList() {
      this.noMoreData = false;
      getUserList(this.page).then(data => {
        if (data.state === 100) {
          if (this.page === 1) {
            this.userList = [];
          }
          let records = data.data.records;
          if (!records || records.length === 0) {
            this.noMoreData = true;
          }
          this.userList = this.userList.concat(records)
        }
      }).catch(reason => {
        
      })
    },

    onUserLoadMore() {
      if (this.userList.length >= pageSize) {
        this.page++;
        this.getUsersList();
      }
    },

    onBatchCreateUser(e) {
      this.showCreateDialog = false;
      batchCreateUser(e).then(data => {
        if (data.state === 100) {
          this.page = 1;
          this.getUsersList();
        } else {
          this.$message.error(data.message)
        }
      }).catch(reason => {

      })
    },

    onDeleteUser(id, index) {
      this.$alertDialog("确定删除?").then(() => {
        deleteUser(id).then(data => {
          if (data.state === 100) {
            this.userList.splice(index, 1);
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

.userList {
  display: grid;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 15px;
  margin-right: 15px;
  overflow: scroll;
  max-height: calc(100vh - 150px);
}

.userList::-webkit-scrollbar {
  display: none;
}

</style>