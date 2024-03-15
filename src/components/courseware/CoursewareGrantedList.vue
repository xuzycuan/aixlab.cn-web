<template>
  <div class="grantList">
    <CoursewareGrantedItem v-for="(item,index) in grantedUsers" :key="index" :data="item" :index="index" @deleteGrant="deleteGrant"/>
    <div v-if="noMoreData" style="width: 100%; height:50px;">请添加授权教师~</div>
  </div>
</template>

<script>
import CoursewareGrantedItem from "@/components/courseware/CoursewareGrantedItem";
import { getUserGranted } from "@/http/grantRequest"

export default {
  name: "CoursewareGrantedList",
  components: { CoursewareGrantedItem },
  props: {
    cuswareId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      noMoreData: true,
      grantedUsers: [ ],
    }
  },
  mounted() {
    this.getGrantedUsers(this.cuswareId)
  },
  methods: {
    getGrantedUsers(id){
      getUserGranted(id,1).then(data => {
        this.noMoreData = false;
        if (data.state === 100) {
          this.grantedUsers = [];
          let records = data.data;
          if (!records || records.length === 0) {
          this.noMoreData = true;
          }
          this.grantedUsers = this.grantedUsers.concat(records)
        }
      }).catch(reason => {

      })
    },
    deleteGrant(id, index){
      let user = this.findUser(id);
      if (user) this.$emit("deleteGrant", user);
    },
    findUser(id){
      for(var i = 0; i < this.grantedUsers.length; i ++) {
        if(this.grantedUsers[i].id == id) {
          return this.grantedUsers[i];
        }
      }
      return null;
    },
    addUser(user) {
      this.grantedUsers.push(user);
      this.grantedUsers.sort();
      this.noMoreData = false;
    },
    deleteUser(user) {
      for(var i = 0; i < this.grantedUsers.length; i ++) {
        if(this.grantedUsers[i].id == user.id) {
          this.grantedUsers.splice(i, 1);
          break;
        }
      }
      this.noMoreData = (this.grantedUsers.length<=0);
    },
    getUserIds(){
      var userIds = [];
      for(var i = 0; i < this.grantedUsers.length; i ++) {
        userIds.push(this.grantedUsers[i].id);
      }
      return userIds;
    }
  },
}
</script>

<style scoped>

.grantList {
  overflow: scroll;
  max-height: 300px;
  width: 260px;
}

.grantList::-webkit-scrollbar {
  display: none;
}

</style>