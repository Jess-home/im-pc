<template>
  <div id="app" :style="full_size">
    <div v-if="showSide" class="sidebar">
      <mycard :key="new Date().getTime()"></mycard>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import mycard from './components/mycard/mycard';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/reset.css';

export default {
  name: 'App',
  components: {
    mycard
  },
  data() {
    return {
      showSide: false,
      is_full: true,
      full_size: {
        height: '100vh',
        width: '100vw'
      },
      normal_size: {
        width: '1260px',
        height: '900px'
      }
    };
  },
  watch: {
    $route(route) {
      this.showSide = route.meta && route.meta.showSide;
      this.is_full = route.meta && route.meta.isFull;
    }
  },
  mounted() { }
};
</script>

<style lang="less">
html,
body {
  overflow: hidden;
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

body {
  font-size: 16px;
  background-color: #eee;
  -webkit-font-smoothing: antialiased;
}

#app {
  width: 860px;
  height: 600px;
  background-color: #fff;
  display: flex;
}
</style>
<style lang="stylus" scoped>
.sidebar {
  width: 60px;
  background: #fff;
  border-right: 1px solid #F3F3F3;
}

.main {
  flex: 1;
}

.tox-notifications-container{
  display: none!important;
}
</style>
