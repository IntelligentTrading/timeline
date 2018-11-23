<template>
  <div id="app" >
    <el-header>
    <img src="https://intelligenttrading.org/wp-content/uploads/itf-logo-blue.png" style='height:40px'>
  </el-header>
        <router-view/>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
