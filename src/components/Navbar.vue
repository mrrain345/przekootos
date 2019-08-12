<template>
  <div id="nav" v-if="loaded">
      <router-link to="/" class="exact">Home</router-link>
      <router-link to="/ranking">Ranking</router-link>
      <router-link to="/login" v-if="!logged">Login</router-link>
      <router-link to="/register" v-if="!logged">Register</router-link>
      <router-link to="/logout" v-if="logged">Logout</router-link>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data: () => ({
    logged: false,
    loaded: false,
  }),
  created() {
    fetch('/api/session')
      .then(res => res.json())
      .then((res) => {
        this.logged = res.ok;
        this.loaded = true;
      });

    this.$root.$on('login', (login) => {
      this.logged = login;
    });
  },
};
</script>


<style scoped>
#nav {
  padding: 30px;
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
