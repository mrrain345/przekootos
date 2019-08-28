<template>
  <div>
    <div v-if="loaded">
      <History/>
      <div class="margin"></div>
      <Settings :user.sync="user"/>
      <div class="margin"></div>
    </div>
  </div>
</template>

<script>
import History from '@/components/History.vue';
import Settings from '@/components/Settings.vue';

export default {
  name: 'profile',
  data: () => ({
    user: null,
    loaded: false,
  }),
  components: {
    History,
    Settings,
  },
  beforeCreate() {
    fetch('/api/session')
      .then(res => res.json())
      .then((res) => {
        if (!res.ok) this.$router.push({ path: '/login' });
        else {
          this.user = res.user;
          this.loaded = true;
        }
      });
  },
};
</script>

<style scoped>
.margin {
  margin-top: 30px;
}
</style>
