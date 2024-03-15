<template>
  <div>
    <Title ref="AppTitle" />
    <div class="main">
      <!--   头部菜单   -->
      <div class="menu">
        <div>设备管理</div>

        <el-button class="createBtn" type="primary" size="small" @click="showCreateDialog=true">+ 添加设备</el-button>
      </div>
      <!--   设备列表   -->
      <div class="devList" v-infinite-scroll="onDeviceLoadMore" :infinite-scroll-disabled="noMoreData" style="overflow: auto">
        <DeviceItem v-for="(item,index) in devList" :key="index" :data="item" :index="index" @deleteDevice="deleteDevice"/>
        <NoMoreData v-if="noMoreData"/>
      </div>
    </div>
    <DeviceCreateDialog :show-dialog="showCreateDialog" @cancel="showCreateDialog = false" @ok="createDevice"/>
  </div>
</template>

<script>
import Title from "@/components/common/Title";
import DeviceItem from "@/components/device/DeviceItem";
import DeviceCreateDialog from "@/components/device/DeviceCreateDialog";
import NoMoreData from "@/components/common/NoMoreData";
import { getDevList, createDev, deleteDev, pageSize } from "@/http/deviceRequest"

export default {
  name: "Device",
  components: { NoMoreData, DeviceCreateDialog, DeviceItem, Title },
  data() {
    return {
      page: 1,
      devList: [],
      showCreateDialog: false,
      noMoreData: false,
    }
  },
  mounted() {
    this.$refs.AppTitle.switchTitle('设备管理');
    this.getDeviceList();
  },
  methods: {
    /**
     *  请求项目列表
     */
    getDeviceList() {
      this.noMoreData = false;
      getDevList(this.page).then(data => {
        if (data.state === 100) {
          if (this.page === 1) {
            this.devList = [];
          }
          let records = data.data.records;
          if (!records || records.length === 0) {
            this.noMoreData = true;
          }
          this.devList = this.devList.concat(records)
        }
      }).catch(reason => {

      })
    },

    onDeviceLoadMore() {
      if (this.devList.length >= pageSize) {
        this.page++;
        this.getDeviceList();
      }
    },

    createDevice(e) {
      this.showCreateDialog = false;
      createDev(e).then(data => {
        if (data.state === 100) {
          this.page = 1;
          this.getDeviceList();
        }
      }).catch(reason => {

      })
    },

    deleteDevice(id, index) {
      this.$alertDialog("确定删除?").then(() => {
        deleteDev(id).then(data => {
          if (data.state === 100) {
            this.devList.splice(index, 1);
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

.createBtn {
  position: absolute;
  right: 0;
}

.devList {
  display: grid;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 15px;
  margin-right: 15px;
  overflow: scroll;
  max-height: calc(100vh - 150px);
}
 
.devList::-webkit-scrollbar {
  display: none;
}

</style>