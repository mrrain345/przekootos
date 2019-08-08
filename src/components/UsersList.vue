<template>
  <div class="container">
    <div v-for="(user, id) in users" :key="id">
      <UserItem :id="id" :user="user"/>
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
  }),
  mounted() {
    fetch('/api/users')
      .then(res => res.json())
      .then((res) => { this.users = res; });
  },
};
</script>
