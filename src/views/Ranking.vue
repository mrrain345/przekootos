<template>
  <div class="container">
    <div id="nav">
      <router-link to="/ranking/day">Day</router-link>
      <router-link to="/ranking/week">Week</router-link>
      <router-link to="/ranking/month">Month</router-link>
      <router-link to="/ranking/year">Year</router-link>
      <router-link to="/ranking/all">All</router-link>
    </div>
    <div v-for="(user, id) in users" :key="id">
      <RankingItem :id="id+1" :user="user"/>
    </div>
  </div>
</template>

<script>
import RankingItem from '@/components/RankingItem.vue';

export default {
  name: 'ranking',
  components: {
    RankingItem,
  },
  data: () => ({
    users: [],
    time: 'day',
  }),
  methods: {
    updateRanking(time) {
      this.time = (!time) ? 'day' : time;
      if (!['day', 'week', 'month', 'year', 'all'].includes(time)) {
        this.$router.replace('/ranking');
        return;
      }

      fetch(`/api/users/all/likes/${this.time}`)
        .then(res => res.json())
        .then((res) => {
          this.users = res.users;
        });
    },
  },
  created() {
    this.updateRanking(this.$route.params.time);
  },
  beforeRouteUpdate(to, from, next) {
    if (!['day', 'week', 'month', 'year', 'all'].includes(to.params.time)) {
      return next('/ranking');
    }

    this.updateRanking(to.params.time);
    return next();
  },
};
</script>

<style scoped>
#nav {
  padding: 30px;
  padding-top: 0;
  text-align: center;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  letter-spacing: 1px;
  border-left: solid #2c3e50 2px;
  padding: 0 5px;
}

#nav a:first-child {
  border-left: none;
}

#nav a.router-link-active:not(.exact) {
  color: #2196f3;
}

#nav a.router-link-exact-active.exact {
  color: #2196f3;
}
</style>
