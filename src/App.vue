<template>
  <div id="app">
      <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>

    export default {
        name: 'app',
        created() {
            sessionStorage.setItem('code_2001',0);
            sessionStorage.setItem('wx',0);
        }
    }
</script>
