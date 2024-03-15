<template>
  <el-dialog
      title="教师课件授权"
      :visible.sync="showDialog"
      width="600px"
      height="400px"
      :before-close="cancelDialog">
    <div class="selectItem" style="margin-bottom: 15px">
      <div>快速筛选</div>
      <el-input placeholder="请输入教师用户名" v-model="kw" @keyup.enter.native="find" style="margin-left: 12px; width: 190px;"/>
      &nbsp;
      <el-button @click="find">筛 选</el-button>
    </div>
    <div style="display: flex;">
      <div class="ungrant">
        <div style="height: 30px;">可授权教师:</div>
        <CoursewareUngrantList v-if="showDialog" ref="ungrant" :cuswareId="cuswareId" @addGrant="addGrant"/>
      </div>
      <div style="width: 32px;"></div>
      <div class="granted">
        <div style="height: 30px;">已授权教师:</div>
        <CoursewareGrantedList v-if="showDialog" ref="granted" :cuswareId="cuswareId" @deleteGrant="deleteGrant"/>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import CoursewareUngrantList from "@/components/courseware/CoursewareUngrantList";
import CoursewareGrantedList from "@/components/courseware/CoursewareGrantedList";

export default {
  name: "CoursewareGrantDialog",
  components: { CoursewareUngrantList, CoursewareGrantedList },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    cuswareId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      kw: ''
    }
  },
  methods: {
    find() {
      this.$refs.ungrant.filterUser(this.kw);
    },
    addGrant(user){
      this.$refs.ungrant.deleteUser(user);
      this.$refs.granted.addUser(user);
    },
    deleteGrant(user){
      this.$refs.ungrant.addUser(user);
      this.$refs.granted.deleteUser(user);
    },
    ok() {
      let data = {
        cuswareId: this.cuswareId,
        userIds: this.$refs.granted.getUserIds().join(',')
      }
      this.$emit("ok", data)
    },
    cancelDialog() {
      this.$emit("cancel")
    }
  }
}
</script>

<style scoped>

.selectItem {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.grantDeleteBtn {
  position: absolute;
  right: 5px;
  top: 5px;
}

.grantInfo {
  position: relative;
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.grantName {
  font-weight: bold;
  font-size: 15px;
  margin-left: 15px;
  max-width: calc(100% - 30px);
}

.grantDate {
  color: #888;
  font-size: 14px;
  margin-left: 15px;
  max-width: calc(100% - 30px);
}

.grantItem {
  position: relative;
  margin-bottom: 5px;
  border-radius: 3px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 1px 0 #eee;
}

.grantList {
  overflow: scroll;
  max-height: 300px;
  width: 260px;
}

.grantList::-webkit-scrollbar {
  display: none;
}

/*
.granted, .ungrant {
  overflow: scroll;
  max-height: 300px;
}

.granted::-webkit-scrollbar {
  display: none;
}

.ungrant::-webkit-scrollbar {
  display: none;
}
*/
</style>