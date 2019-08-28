<template>
  <div>
    <a class="btn btn-github btn-light btn-block" :href="`https://github.com/login/oauth/authorize?scope=read:user,user:email&client_id=${client_id}`">
      <img src="/github.png"/><span>GitHub</span>
    </a>
  </div>
</template>

<script>
export default {
  name: 'GitHub',
  data: () => ({
    client_id: '6f85928125d9b221f454',
  }),
};
</script>

<style scoped>
img {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.btn-github {
  margin-top: 20px;
  width: 100%;
  height: 38px;
}
</style>
