<template>
  <div class="card">
    <div class="cardInfo">
      <!--div class="cardName singleLine">{{ data.name }}</div-->
      <div class="cardName singleLine">{{ data.name }} | <b>{{ data.sn }}</b></div>
      <div class="cardDate">{{ data.effectDate }}</div>
    </div>
    <el-button class="cardDeleteBtn" icon="el-icon-delete" circle size="small" type="danger" @click="deleteDevice"/>
  </div>
</template>

<script>

export default {
  name: "DeviceItem",
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
    deleteDevice() {
      this.$emit("deleteDevice", this.data.id, this.index)
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

.cardSN {
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