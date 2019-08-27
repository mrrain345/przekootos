<template>
  <div>
    <div v-if="loaded">
      <History :user="user"/>
    </div>
  </div>
</template>

<script>
import History from '@/components/History.vue';

export default {
  name: 'profile',
  data: () => ({
    user: null,
    loaded: false,
  }),
  components: {
    History,
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
