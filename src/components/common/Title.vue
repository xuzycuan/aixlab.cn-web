<template>
  <div class="title">
    <div><el-image :src="aixlab" class="aixlab"/></div>
    <div class="appName">{{ appName }}</div>
    <div style="color: white" @click="back">{{ appTitle }}</div>

    <el-popover class="userInfoClick"
                placement="bottom"
                trigger="click">
      <div>
        <div style="width: 100%; display: grid; align-items: center; justify-content: center">
          <el-button size="small" style="width: 120px" @click="goHome">项目管理</el-button>
          <el-button size="small" style="width: 120px; margin-top: 10px; margin-left: 0px !important;" @click="datasetsCenter">数据集管理</el-button>
          <el-button size="small" style="width: 120px; margin-top: 10px; margin-left: 0px !important;" @click="courseCenter">课程管理</el-button>
          <el-button size="small" style="width: 120px; margin-top: 10px; margin-left: 0px !important;" @click="docCenter">文档管理</el-button>
          <el-button v-show="isUserLevel2" size="small" style="width: 120px; margin-top: 10px; margin-left: 0px !important;" @click="deviceMgr">设备管理</el-button>
          <el-button v-show="isUserLevel2" size="small" style="width: 120px; margin-top: 10px; margin-left: 0px !important;" @click="userMgr">用户管理</el-button>
          <el-button size="small" style="width: 120px; margin-top: 10px; margin-left: 0px !important;" @click="logOut">退出登录</el-button>
        </div>
      </div>
      <div class="userInfo" slot="reference">
        <el-image class="avatar" :src="userAvatar"/>
        <div class="name">{{ username }}</div>
      </div>
    </el-popover>

  </div>
</template>

<script>
import img from '@/assets/logo.png'
import aixlab from '@/assets/aixlab.png'

export default {
  name: "Title",
  props:{
    canBack:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      aixlab: aixlab,
      appName: this.$store.state.appName,
      appTitle: '',
      userAvatar: img,
      username: this.$store.getters.username,
      userlevel: this.$store.getters.userlevel,
      isUserLevel1: false,
      isUserLevel2: false
    }
  },
  mounted() {
    this.isUserLevel1 = (this.userlevel >= 1);
    this.isUserLevel2 = (this.userlevel >= 2);
  },
  methods:{
    goHome(){
      this.$router.push({path:"/home"});
    },

    datasetsCenter(){
      this.$router.push({path:"/datasets"});
    },

    docCenter(){
      this.$router.push({path:"/docs"});
    },

    courseCenter(){
      this.$router.push({path:"/course"});
    },

    deviceMgr(){
      this.$router.push({path:"/device"});
    },

    userMgr(){
      this.$router.push({path:"/users"});
    },

    logOut(){
      this.$alertDialog("确定退出登录?").then(()=>{
        this.$store.commit("saveToken",'')
        this.$store.commit("saveUserlevel",0)
        this.$router.push({path:"/login"})
      }).catch(() => {})
    },

    switchTitle(title) {
      this.appTitle = title;
    },

    back(){
      if (this.canBack){
        this.$router.back();
      }
    }
  }
}
</script>

<style scoped>
.title {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  background: #5274D7;
}

.aixlab {
  position: absolute;
  left: 30px;
  top: 17px;
  width: 100px;
  height: 20px;
}

.appName {
  position: absolute;
  left: 136px;
  color: white;
}

.userInfoClick {
  position: absolute;
  right: 30px;
}

.userInfo {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 100%;
}

.name {
  color: white;
  margin-left: 10px;
}
</style>