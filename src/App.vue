<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>


import Login from "@/components/login/Login";

export default {
  name: 'App',
  components: {
    Login
  },
  mounted() {

  }
}
</script>

<style>
.singleLine{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
}
</style>
