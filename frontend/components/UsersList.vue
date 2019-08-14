<template>
  <div class="container">
    <div v-if="loaded==2">
      <div v-for="user in users" :key="user.id">
        <UserItem :me="me" :user="user"/>
      </div>
    </div>
  </div>
</template>

<script>
import UserItem from '@/components/UserItem.vue';

export default {
  name: 'UsersList',
  components: {
    UserItem,
  },
  data: () => ({
    users: [],
    me: null,
    loaded: 0,
  }),
  created() {
    this.loaded = 0;

    fetch('/api/session')
      .then(res => res.json())
      .then((res) => {
        if (res.ok) this.me = res.user.id;
        else this.me = null;
        this.loaded += 1;
      });

    fetch('/api/users')
      .then(res => res.json())
      .then((res) => {
        this.users = res;
        this.loaded += 1;
      });
  },
};
</script>
