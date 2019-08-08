<template>
  <div class="container" v-if="show">
    <div class="row">
      <Banner msg="Create your account!"/>
      <div class="col-1 col-sm-2 d-md-none"></div>
      <RegisterPanel/>
    </div>
  </div>
</template>

<script>
import RegisterPanel from '@/components/RegisterPanel.vue';
import Banner from '@/components/Banner.vue';

export default {
  name: 'register',
  components: {
    RegisterPanel,
    Banner,
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
