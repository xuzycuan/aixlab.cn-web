<template>
  <div class="card">
    <el-image class="cardImage"
              :src="data.imagePath"
              onerror="this.src='/images/404.png'"
              fit="cover"></el-image>
    <div class="cardInfo">
      <div class="cardName singleLine">{{ data.name }}</div>
      <el-button class="cardBtn" type="warning" size="small" @click="goCourseware">课件管理</el-button>
    </div>
    <!--el-button class="cardGrantBtn" icon="el-icon-lock" circle size="small" type="warning" @click="grantCourse"/-->
    <el-button class="cardDeleteBtn" icon="el-icon-delete" circle size="small" type="danger" v-if="isUserLevel2" @click="deleteCourse"/>
  </div>
</template>

<script>

export default {
  name: "CourseItem",
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
    goCourseware() {
      this.$router.push({path: '/courseware', query: { id: this.data.id }})
    },
    grantCourse() {
      //
    },
    deleteCourse() {
      this.$emit("deleteCourse", this.data.id, this.index)
    }
  }
}
</script>

<style scoped>
.card {
  position: relative;
  width: calc(25% - 33px);
  height: 280px;
  margin-left: 15px;
  margin-right: 15px;
  margin-bottom: 30px;
  border-radius: 15px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 1px 0 #eee;
}

.cardGrantBtn {
  position: absolute;
  right: 45px;
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
  font-size: 15px;
  margin-left: 15px;
  max-width: calc(100% - 130px);
}

.cardBtn {
  position: absolute;
  right: 15px;
}
</style>