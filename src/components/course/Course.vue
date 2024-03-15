<template>
  <div>
    <Title ref="AppTitle" />
    <div class="main">
      <!--   头部菜单   -->
      <div class="menu">
        <div>课程管理</div>

        <el-button class="createBtn" type="primary" size="small" v-if="isUserLevel2" @click="showCreateDialog=true">+ 新建课程</el-button>
      </div>
      <!--   文档列表   -->
      <div class="courseList" v-infinite-scroll="onCourseLoadMore" :infinite-scroll-disabled="noMoreData" style="overflow: auto">
        <CourseItem v-for="(item,index) in courseList" :key="index" :data="item" :index="index" @deleteCourse="deleteCourse"/>
        <NoMoreData v-if="noMoreData"/>
      </div>
    </div>
    <CourseCreateDialog :show-dialog="showCreateDialog" @cancel="showCreateDialog = false" @ok="createCourse"/>
  </div>
</template>

<script>
import Title from "@/components/common/Title";
import CourseItem from "@/components/course/CourseItem";
import CourseCreateDialog from "@/components/course/CourseCreateDialog";
import NoMoreData from "@/components/common/NoMoreData";
import { getCusList, createCus, deleteCus, pageSize } from "@/http/courseRequest"

export default {
  name: "Course",
  components: { NoMoreData, CourseCreateDialog, CourseItem, Title },
  data() {
    return {
      page: 1,
      courseList: [],
      showCreateDialog: false,
      noMoreData: false,
      userlevel: this.$store.getters.userlevel,
      isUserLevel2: false
    }
  },
  mounted() {
    this.$refs.AppTitle.switchTitle('课程管理');
    this.isUserLevel2 = (this.userlevel >= 2);
    this.getCourseList();
  },
  methods: {
    /**
     *  请求项目列表
     */
    getCourseList() {
      this.noMoreData = false;
      getCusList(this.page).then(data => {
        if (data.state === 100) {
          if (this.page === 1) {
            this.courseList = [];
          }
          let records = data.data.records;
          if (!records || records.length === 0) {
            this.noMoreData = true;
          }
          this.courseList = this.courseList.concat(records)
        }
      }).catch(reason => {
      })
    },

    onCourseLoadMore() {
      if (this.courseList.length >= pageSize) {
        this.page++;
        this.getCourseList();
      }
    },

    createCourse(e) {
      this.showCreateDialog = false;
      createCus(e).then(data => {
        if (data.state === 100) {
          this.page = 1;
          this.getCourseList();
        }
      }).catch(reason => {
      })
    },

    deleteCourse(id, index) {
      this.$alertDialog("确定删除?").then(() => {
        deleteCus(id).then(data => {
          if (data.state === 100) {
            this.courseList.splice(index, 1);
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

.courseList {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 15px;
  margin-right: 15px;
  overflow: scroll;
  max-height: calc(100vh - 150px);
}

.courseList::-webkit-scrollbar {
  display: none;
}

</style>