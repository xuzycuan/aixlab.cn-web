<template>
  <div class="grantList">
    <CoursewareUngrantItem v-for="(item,index) in ungrantUsers" :key="index" :data="item" :index="index" @addGrant="addGrant"/>
    <div v-if="noMoreData" style="width: 100%; height:50px;">请创建教师账号~</div>
  </div>
</template>

<script>
import CoursewareUngrantItem from "@/components/courseware/CoursewareUngrantItem";
import { getUserUngrant } from "@/http/grantRequest"

export default {
  name: "CoursewareUngrantList",
  components: { CoursewareUngrantItem },
  props: {
    cuswareId: {
      type: String,
      default: ''
    },
    filterEnabled: {
      type: Boolean,
      default: false
    },
    filterKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      noMoreData: true,
      ungrantUsers: [ ],
      _ungrantUsers: [ ]
    }
  },
  mounted() {
    this.getUngrantUsers(this.cuswareId)
  },
  methods: {
    getUngrantUsers(id){
      getUserUngrant(id,1).then(data => {
        this.noMoreData = false;
        if (data.state === 100) {
          this.ungrantUsers = [ ];
          let records = data.data;
          if (!records || records.length === 0) {
            this.noMoreData = true;
          }
          this.ungrantUsers = this.ungrantUsers.concat(records)
//          this.ungrantUsers.sort(function(a, b) { return a.account.localeCompare(b.account); });
          this.ungrantUsers.sort(function(a, b) { return a.id - b.id; });
        }
      }).catch(reason => {

      })
    },
    filterUser(kw) {
      if (kw.trim().length > 0) {
        if (!this.filterEnabled) {
          this._ungrantUsers = this.ungrantUsers
        }

        this.filterEnabled = true;
        this.filterKey = kw.trim();

        var filtered = [ ];

        for (var i = 0; i < this._ungrantUsers.length; i ++) {
          if(this._ungrantUsers[i].account.indexOf(this.filterKey) != -1) {
            filtered.push(this._ungrantUsers[i]);
          }
        }

        this.ungrantUsers = filtered;
//        this.ungrantUsers.sort(function(a, b) { return a.account.localeCompare(b.account); });
        this.ungrantUsers.sort(function(a, b) { return a.id - b.id; });

      } else {
        this.filterEnabled = false;
        this.filterKey = '';

        this.ungrantUsers = this._ungrantUsers;
//        this.ungrantUsers.sort(function(a, b) { return a.account.localeCompare(b.account); });
        this.ungrantUsers.sort(function(a, b) { return a.id - b.id; });
      }
    },
    addGrant(id, index){
      let user = this.findUser(id);
      if (user) this.$emit("addGrant", user);
    },
    findUser(id){
      for(var i = 0; i < this.ungrantUsers.length; i ++) {
        if(this.ungrantUsers[i].id == id) {
          return this.ungrantUsers[i];
        }
      }
      return null;
    },
    addUser(user) {
      if (this.filterEnabled) {
        this._ungrantUsers.push(user);

        if (user.account.indexOf(this.filterKey) != -1) {
          this.ungrantUsers.push(user);
//          this.ungrantUsers.sort(function(a, b) { return a.account.localeCompare(b.account); });
          this.ungrantUsers.sort(function(a, b) { return a.id - b.id; });
          this.noMoreData = false;
        }

      } else {
        this.ungrantUsers.push(user);
//        this.ungrantUsers.sort(function(a, b) { return a.account.localeCompare(b.account); });
        this.ungrantUsers.sort(function(a, b) { return a.id - b.id; });
        this.noMoreData = false;
      }
    },
    deleteUser(user) {
      if (this.filterEnabled) {
        for(var i = 0; i < this._ungrantUsers.length; i ++) {
          if(this._ungrantUsers[i].id == user.id) {
            this._ungrantUsers.splice(i, 1);
            break;
          }
        }
      }
      for(var i = 0; i < this.ungrantUsers.length; i ++) {
        if(this.ungrantUsers[i].id == user.id) {
          this.ungrantUsers.splice(i, 1);
//          this.ungrantUsers.sort(function(a, b) { return a.account.localeCompare(b.account); });
          this.ungrantUsers.sort(function(a, b) { return a.id - b.id; });
          break;
        }
      }
      this.noMoreData = (this.ungrantUsers.length<=0);
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