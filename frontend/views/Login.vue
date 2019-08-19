<template>
  <div class="container" v-if="show">
    <div class="row">
      <div class="col-1 col-sm-2 d-md-none"></div>
      <LoginPanel/>
      <Banner msg="Login to your account!"/>
      <GitHub/>
    </div>
  </div>
</template>

<script>
import LoginPanel from '@/components/LoginPanel.vue';
import Banner from '@/components/Banner.vue';
import GitHub from '@/components/GitHub.vue';

export default {
  name: 'login',
  components: {
    LoginPanel,
    Banner,
    GitHub,
  },
  data: () => ({
    show: false,
  }),
  beforeCreate() {
    fetch('/api/session')
      .then(res => res.json())
      .then((res) => {
        if (res.ok) this.$router.push({ path: '/' });
        else this.show = !res.ok;
      });
  },
};
</script>
