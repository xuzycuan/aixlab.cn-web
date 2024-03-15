<template>
  <div class="grantItem">
    <div class="grantInfo">
      <div class="grantName">{{ data.account }}</div>
    </div>
    <el-button class="grantAddBtn" icon="el-icon-plus" circle size="small" type="success" @click="addGrant"/>
  </div>
</template>

<script>

export default {
  name: "CoursewareUngrantItem",
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
    addGrant() {
      this.$emit("addGrant", this.data.id, this.index)
    }
  }
}
</script>

<style scoped>

.grantAddBtn {
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

</style>