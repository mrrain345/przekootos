<template>
  <div class="container">
    <div v-for="user in users" :key="user.id">
      <UserItem :me="me" :user="user"/>
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
  }),
  beforeMount() {
    fetch('/api/session')
    .then(res => res.json())
    .then(res => { 
      if (res.ok) this.me = res.user.id;
      else this.me = null;
    });

    fetch('/api/users')
    .then(res => res.json())
    .then((res) => { this.users = res; });
  },
};
</script>
