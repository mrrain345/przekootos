<template>
  <div class="panel">
    <div id="text">Votes today: <span>{{limit-left}} / {{limit}}</span></div>
    <div id="username">{{username}}</div>
    <div style="clear: both;"></div>
  </div>
</template>

<script>
export default {
  props: ['limit', 'left', 'username'],
};
</script>

<style scoped>
.panel {
  margin: 20px 0;
  padding-left: 30px;
  font-weight: bold;
  font-size: 24px;
  letter-spacing: 1px;
  color: #E3F2FD;
}

#text {
  float: left;
}

#username {
  float: right;
  color: #BBDEFB;
}

span {
  color: #BBDEFB;
}
</style>
