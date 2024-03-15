<template>
  <div>
    <Title ref="AppTitle" :can-back="true" />
    <div class="main">
      <!--   头部菜单   -->
      <div class="menu">
        <div>课件管理</div>

        <el-button class="uploadBtn" type="primary" size="small" v-if="isUserLevel2" @click="showUploadDialog=true">+ 上传新课件</el-button>
      </div>
      <!--   文档列表   -->
      <div class="cuswareList" v-infinite-scroll="onCoursewareLoadMore" :infinite-scroll-disabled="noMoreData" infinite-scroll-immediate="true" infinite-scroll-distance="1" style="overflow: auto">
        <CoursewareItem v-for="(item,index) in cuswareList" :key="index" :data="item" :index="index" @grantStudentCourseware="grantStudentCourseware" @grantCourseware="grantCourseware" @deleteCourseware="deleteCourseware"/>
        <NoMoreData v-if="noMoreData"/>
      </div>
    </div>
    <CoursewareUploadDialog :show-dialog="showUploadDialog" @cancel="showUploadDialog=false" @ok="createCourseware"/>
    <CoursewareGrantDialog ref="grantDialog" :show-dialog="showGrantDialog" :cuswareId="cuswareId" @cancel="showGrantDialog=false" @ok="commitGrantCourseware"/>
    <StudentCoursewareGrantDialog ref="studentGrantDialog" :show-dialog="showStudentGrantDialog" :cuswareId="cuswareId" @cancel="showStudentGrantDialog=false" @ok="commitStudentGrantCourseware"/>
  </div>
</template>

<script>
import Title from "@/components/common/Title";
import CoursewareItem from "@/components/courseware/CoursewareItem";
import CoursewareUploadDialog from "@/components/courseware/CoursewareUploadDialog";
import CoursewareGrantDialog from "@/components/courseware/CoursewareGrantDialog";
import StudentCoursewareGrantDialog from "@/components/courseware/StudentCoursewareGrantDialog";
import NoMoreData from "@/components/common/NoMoreData";
import { getCuswareList, createCusware, deleteCusware, pageSize } from "@/http/coursewareRequest"
import { commitUserGrant } from "@/http/grantRequest"

export default {
  name: "Courseware",
  components: { NoMoreData, CoursewareUploadDialog, CoursewareGrantDialog, StudentCoursewareGrantDialog, CoursewareItem, Title },
  data() {
    return {
      id: '',
      page: 1,
      cuswareId: '',
      cuswareList: [],
      showUploadDialog: false,
      showGrantDialog: false,
      showStudentGrantDialog: false,
      noMoreData: false,
      userlevel: this.$store.getters.userlevel,
      isUserLevel2: false
    }
  },
  mounted() {
    this.id = this.$route.query.id;
    this.$refs.AppTitle.switchTitle('课程管理');
    this.isUserLevel2 = (this.userlevel >= 2);
    this.getCoursewareList();
  },
  methods: {
    /**
     *  请求课件列表
     */
     getCoursewareList() {
      this.noMoreData = false;
      getCuswareList(this.page, this.id).then(data => {
        if (data.state === 100) {
          if (this.page === 1) {
            this.cuswareList = [];
          }
          let records = data.data.records;
          if (!records || records.length === 0) {
            this.noMoreData = true;
          }
          this.cuswareList = this.cuswareList.concat(records)
        }
      }).catch(reason => {

      })
    },

    onCoursewareLoadMore() {
      if (this.cuswareList.length >= pageSize) {
        this.page++;
        this.getCoursewareList();
      }
    },

    createCourseware(e) {
      this.showUploadDialog = false;
      let data = {
        courseId: this.id,
        name: e.name,
        file: e.file
      }
      createCusware(data).then(data => {
        if (data.state === 100) {
          this.page = 1;
          this.getCoursewareList();
        }
      }).catch(reason => {

      })
    },

    deleteCourseware(id, index) {
      this.$alertDialog("确定删除?").then(() => {
        deleteCusware(id).then(data => {
          if (data.state === 100) {
            this.cuswareList.splice(index, 1);
          } else {
            this.$message.error("删除失败")
          }
        }).catch(reason => {

        })
      }).catch(() => {

      })
    },

    grantCourseware(id, index) {
      this.cuswareId = id;
      this.showGrantDialog = true;
    },

    commitGrantCourseware(data) {
      this.showGrantDialog = false;
      commitUserGrant(data.cuswareId, 1, data.userIds).then(data => {
        if (data.state === 100) {
          //
        } else {
          this.$message.error("授权失败")
        }
      }).catch(reason => {

      })
    },

    grantStudentCourseware(id, index) {
      this.cuswareId = id;
      this.showStudentGrantDialog = true;
    },

    commitStudentGrantCourseware(data) {
      this.showStudentGrantDialog = false;
      commitUserGrant(data.cuswareId, 0, data.userIds).then(data => {
        if (data.state === 100) {
          //
        } else {
          this.$message.error("授权失败")
        }
      }).catch(reason => {

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

.cuswareList {
  display: grid;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 15px;
  margin-right: 15px;
  overflow: scroll;
  max-height: calc(100vh - 150px);
}

.cuswareList::-webkit-scrollbar {
  display: none;
}

</style>
