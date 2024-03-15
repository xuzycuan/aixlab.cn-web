<template>
  <div class="card">
    <div class="cardInfo">
      <div class="cardName">{{ data.name }}</div>
      <div class="cardDate">{{ data.uploadDate }}</div>
    </div>
    <el-button class="cardPlayBtn" icon="el-icon-caret-right" circle size="small" type="warning" @click="playCourseware"/>
    <el-button class="cardGrantStudentBtn" icon="el-icon-user" circle size="small" type="warning" v-if="isUserLevel2" @click="grantStudentCourseware"/>
    <el-button class="cardGrantBtn" icon="el-icon-unlock" circle size="small" type="warning" v-if="isUserLevel2" @click="grantCourseware"/>
    <el-button class="cardDeleteBtn" icon="el-icon-delete" circle size="small" type="danger" v-if="isUserLevel2" @click="deleteCourseware"/>
  </div>
</template>

<script>

export default {
  name: "CoursewareItem",
  props: {
    data: {
      type: Object,
      default: {}
    },
    index: {
      type: Number
    }
  },
  data() {
    return {
      userlevel: this.$store.getters.userlevel,
      isUserLevel2: false
    }
  },
  mounted() {
    this.isUserLevel2 = (this.userlevel >= 2);
  },
  methods: {
    playCourseware() {
      window.open("/play.html?id=" + this.data.id, "_blank");
    },
    grantStudentCourseware() {
      this.$emit("grantStudentCourseware", this.data.id, this.index)
    },
    grantCourseware() {
      this.$emit("grantCourseware", this.data.id, this.index)
    },
    deleteCourseware() {
      this.$emit("deleteCourseware", this.data.id, this.index)
    }
  }
}
</script>

<style scoped>

.card {
  position: relative;
  margin-left: 15px;
  margin-right: 15px;
  margin-bottom: 5px;
  border-radius: 3px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 1px 0 #eee;
}

.cardPlayBtn {
  position: absolute;
  right: 45px;
  top: 5px;
}

.cardGrantStudentBtn {
  position: absolute;
  right: 125px;
  top: 5px;
}

.cardGrantBtn {
  position: absolute;
  right: 85px;
  top: 5px;
}

.cardDeleteBtn {
  position: absolute;
  right: 5px;
  top: 5px;
}

.cardImage {
  width: 100%;
  height: 230px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.cardInfo {
  position: relative;
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.cardName {
  font-weight: bold;
  font-size: 15px;
  margin-left: 15px;
  max-width: calc(100% - 130px);
}

.cardDate {
  color: #888;
  font-size: 14px;
  margin-left: 15px;
  max-width: calc(100% - 130px);
}

.cardBtn {
  position: absolute;
  right: 15px;
}

</style>