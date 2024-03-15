<template>
  <div class="card">
    <div class="cardInfo">
      <div class="cardName">{{ data.account }}</div>
      <div class="cardLevel">{{ formatLevel(data.level) }}</div>
      <div class="cardDate">{{ formatTs(data.createDate) }}</div>
    </div>
    <!--el-button class="cardModifyBtn" icon="el-icon-download" circle size="small" type="warning" @click="modifyUser"/-->
    <el-button class="cardDeleteBtn" icon="el-icon-delete" circle size="small" type="danger" @click="deleteUser"/>
  </div>
</template>

<script>

export default {
  name: "UserItem",
  props: {
    data: {
      type: Object,
      default: {}
    },
    index: {
      type: Number
    }
  },
  methods: {
    formatLevel(level) {
      switch(parseInt(level)) {
      case 0: return '学生';
      case 1: return '教师';
      case 2: return '管理员';
      }
    },
    formatTs(bigts) {
      var sts = '' || bigts;
      return [
        sts.substr(0, 4), '-', sts.substr(4, 2), '-', sts.substr(6, 2),
        ' ',
        sts.substr(8, 2), ':', sts.substr(10),
      ].join('');
    },
    modifyUser() {
      
    },
    deleteUser() {
      this.$emit("deleteUser", this.data.id, this.index)
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

.cardModifyBtn {
  position: absolute;
  right: 45px;
  top: 5px;
}

.cardDeleteBtn {
  position: absolute;
  right: 5px;
  top: 5px;
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
  min-width: 120px;
}

.cardLevel {
  color: #888;
  font-size: 14px;
  margin-left: 15px;
  max-width: calc(100% - 130px);
  min-width: 40px;
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