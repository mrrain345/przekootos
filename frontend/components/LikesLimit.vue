<template>
  <div id="panel">
    <div id="text">Votes today: <span>{{d_limit-d_left}} / {{d_limit}}</span></div>
  </div>
</template>

<script>
export default {
  data: () => ({
    d_limit: 0,
    d_left: 0,
  }),
  props: ['limit', 'left'],
  created() {
    this.d_limit = this.limit;
    this.d_left = this.left;

    this.$root.$on('like', ({limit, left}) => {
      this.d_limit = limit;
      this.d_left = left;
    });
  }
}
</script>

<style scoped>
#panel {
  background-color: #2196F3;
  margin: 20px 0;
  padding: 20px 20px;
  padding-left: 30px;
  border-radius: 5px;
  box-shadow: #0277bd 2px 2px 4px 1px;
}

#text {
  font-weight: bold;
  font-size: 24px;
  letter-spacing: 1px;
  color: #E3F2FD;
}

span {
  font-weight: bold;
  color: #BBDEFB;
}
</style>
