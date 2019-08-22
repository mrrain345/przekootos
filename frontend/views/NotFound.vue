<template>
  <div class="container">
    <h1>404. Not found ;(</h1>
    <p>The requested URL <strong>{{url}}</strong> is not exists.</p>
  </div>
</template>

<script>
export default {
  name: 'not-found',
  data: () => ({
    url: '',
  }),
  created() {
    this.url = decodeURIComponent(this.$route.query.u);
  },
};
</script>

<style scoped>
h1 {
  margin-top: 40px;
  font-size: 64px;
  color: #212121;
}

p {
  font-size: 20px;
  color: #616161;
}

strong {
  color: #212121;
}
</style>
