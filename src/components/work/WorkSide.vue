<template>
  <div class="side">
    <div class="sideMenu">
      <!-- <div class="menuItem" :id="item.id" v-for="item in menus" :key="item.id" @click="menuClick(item)">
        <div :style="{
          width:'25px',
          height:'25px',
          background:item.color
        }"></div>
        <div style="margin-top: 10px">{{ item.name }}</div>
      </div> -->
      <div class="menuItem" :id="item.id" v-for="item in menus" :key="item.id"
        :draggable="true"
        :style="{
          cursor: 'move',
          opacity: isDragging ? 0.5 : 1,
        }"
        @dragstart="onDragStart(item, $event)"
        @dragend="onDragEnd($event)"
        >
        <div :style="{
          width:'25px',
          height:'25px',
          background:item.color
        }"></div>
        <div style="margin-top: 10px">{{ item.name }}</div>
      </div>

    </div>
  </div>
</template>

<script>
import {getBlockList,getBlockDetail} from "@/http/workRequest";

export default {
  name: "WorkSide",
  data() {
    return {
      isDragging: false,
      menus: []
    }
  },

  mounted() {
    this.getBlockMenus()
  },

  methods: {
    onDragStart(item, event) {
      event.dataTransfer.setData('data', JSON.stringify(item));
      // console.log('Block data:', JSON.stringify(item));
      this.isDragging = true;
      event.dataTransfer.effectAllowed = 'copy';
    },

    onDragEnd(event){
      this.isDragging = false;
    },
    getBlockMenus() {
      getBlockList().then(data => {
        if (data.state === 100) {
          this.getMenus(data.data)
        }
      }).catch(reason => {
      })
    },
    getMenus(res) {
      this.menus = []
      for (let index=0;index<res.length;index++){
        let item = res[index];
        item.color = this.getColor(item.id)
        this.menus.push(item)
      }
    },

    menuClick(item){
      let div = document.getElementById(item.id);
      div.style = "background:#fff";
      let timer =  setTimeout(()=>{
        div.style = "background:transparent";
        clearTimeout(timer);
      },50)
      this.$emit("blockClick",item)
    },

    getColor(id) {
      switch (parseInt(id)) {
        case 1001:
          return '#FC5E5E';
        case 1002:
          return '#FA7D2A';
        case 1003:
          return '#FDB02C';
        case 1004:
          return '#B2F236';
        case 1005:
          return '#45EC5D';
        case 1006:
          return '#3CEDB4';
        case 1007:
          return '#3AC2F5';
        case 1008:
          return '#3A81F7';
        case 1011:
          return '#654EF5';
        case 1012:
          return '#9557FA';
        case 1013:
          return '#DB5FF1';
        case 1014:
          return '#F55884';
        case 1015:
          return '#F6975F';
        case 1016:
          return '#2BBD8F';
        case 1017:
          return '#638EE5';
        case 1018:
          return '#12BFDE';
        case 1019:
          return '#F67F90';
      }
    }
  }
}
</script>

<style scoped>
.side {
  width: 150px;
  background: #EFF3FF;
  height: 100%;
  overflow: scroll;
}

.side::-webkit-scrollbar {
  display: none;
}

.sideMenu {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.menuItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
  font-size: 12px;
}

</style>