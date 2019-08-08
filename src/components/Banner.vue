<template>
  <div id="title" class="d-none d-md-block col-md-7 col-lg-8">
      <h1>Przekootos</h1>
      <h3>{{ msg }}</h3>
    </div>
</template>

<script>
export default {
  name: 'Banner',
  props: [ 'msg' ]
}
</script>

<style scoped>
#title {
  text-align: center
}

h1 {
  margin-top: 40px;
  color: #2196f3;
  font-size: 64px;
  letter-spacing: 4px;
  text-shadow: 0px 2px 4px;
}

h3 {
  color: #607d8b;
  font-size: 32px;
  letter-spacing: 0.5px;
}
</style>
