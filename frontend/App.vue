<template>
  <div id="app">
    <Navbar/>
    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  name: 'app',
  components: {
    Navbar,
  },
};
</script>

<style>
.panel {
  background-color: #2196F3;
  padding: 20px 20px;
  border-radius: 5px;
  box-shadow: inset #0277bd -1px -1px 4px 0;
  color: #E3F2FD;
}

.username {
  font-weight: bold;
  font-size: 32px;
  letter-spacing: 2px;
  max-height: 96px;
  overflow: hidden;
}

.email {
  color: #BBDEFB;
  font-size: 18px;
  max-height: 27px;
  overflow: hidden;
}
</style>
