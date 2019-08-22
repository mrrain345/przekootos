<template>
  <div class="container">
    <div id="nav">
      <router-link to="/ranking/day">Day</router-link>
      <router-link to="/ranking/week">Week</router-link>
      <router-link to="/ranking/month">Month</router-link>
      <router-link to="/ranking/year">Year</router-link>
      <router-link to="/ranking/all">All</router-link>
    </div>
    <Calendar :mode.sync="time" v-model="date" @input="updateRanking()"/>
    <Chart :users.sync="users" :step.sync="time" :date.sync="date"/>

    <div v-for="(user, id) in users" :key="id">
      <RankingItem :id="id+1" :user="user"/>
    </div>
  </div>
</template>

<script>
import RankingItem from '@/components/RankingItem.vue';
import Calendar from '@/components/Calendar.vue';
import Chart from '@/components/Chart.vue';

export default {
  name: 'ranking',
  components: {
    RankingItem,
    Calendar,
    Chart,
  },
  data: () => ({
    users: [],
    time: 'day',
    date: { from: null, to: null },
  }),
  methods: {
    updateRanking() {
      const from = this.date.from ? `from=${this.date.from.toJSON()}` : '';
      const to = this.date.to ? `to=${this.date.to.toJSON()}` : '';
      let query = (from || to) ? '?' : '';
      if (from) query += from;
      if (from && to) query += '&';
      if (to) query += to;

      fetch(`/api/users/all/likes${query}`)
        .then(res => res.json())
        .then((res) => {
          this.users = res.users;
        });
    },
  },
  beforeRouteUpdate(to, from, next) {
    if (!['day', 'week', 'month', 'year', 'all'].includes(to.params.time)) {
      this.time = 'day';
      return next('/ranking/day');
    }

    this.time = to.params.time;
    return next();
  },
};
</script>

<style scoped>
#nav {
  padding-bottom: 10px;
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
