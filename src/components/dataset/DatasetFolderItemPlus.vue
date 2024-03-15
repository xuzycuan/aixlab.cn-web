<template>
  <div class="folderItem">
    <div class="selectItem">
      <el-input
        placeholder="请输入文件夹名称"
        v-model="name"
        size="small"
        ref="folderInput"
        @focus="adjustLayout"
        @blur="resetLayout"
      />
      <el-button
      class="folderAddBtn"
      style="padding: 4px;"
      icon="el-icon-plus"
      circle
      size="small"
      type="success"
      @click="addFolder"
    />
    </div>
  </div>
</template>

<script>
export default {
  name: "DatasetFolderItemPlus",
  data() {
    return {
      name: "",
      keyboardVisible: false,
      originalTop: null,
      originalLeft: null
    };
  },
  mounted() {
    if (/Android/.test(navigator.userAgent)) {
      window.addEventListener("resize", this.adjustLayout);
    }
  },
  beforeDestroy() {
    if (/Android/.test(navigator.userAgent)) {
      window.removeEventListener("resize", this.adjustLayout);
    }
  },
  methods: {
    addFolder() {
      if (this.name !== "") {
        this.$emit("addFolder", this.name);
      }
    },
    reset() {
      this.name = '';
    },
    adjustLayout() {
      const isAndroid = /Android/.test(navigator.userAgent);
      if (isAndroid) {
        const folderInput = this.$refs.folderInput.$el;
        const rect = folderInput.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const keyboardHeight = window.outerHeight - window.innerHeight;
        const visibleBottom = rect.bottom - scrollY;

        if (visibleBottom > viewportHeight - keyboardHeight) {
          folderInput.style.position = "fixed";
          folderInput.style.top = `${scrollY + 10}px`;
          folderInput.style.left = "50%";
          folderInput.style.transform = "translateX(-50%)";
          this.keyboardVisible = true;
        } else {
          this.resetLayout();
        }
      }
    },
    resetLayout() {
      const folderInput = this.$refs.folderInput.$el;
      folderInput.style.position = "";
      folderInput.style.top = this.originalTop;
      folderInput.style.left = this.originalLeft;
      folderInput.style.transform = "";
      this.keyboardVisible = false;
    }
  }
};
</script>

<style scoped>
.selectItem {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.folderItem {
  position: relative;
  margin-bottom: 5px;
  border-radius: 3px;
  border: 1px solid #eee;
  box-shadow: 1px 1px 1px 0 #eee;
}
</style>
