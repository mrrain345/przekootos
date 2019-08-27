<template>
  <div class="container">
    <div v-if="loaded==3">
      <div v-if="logged">
        <LikesLimit :limit.sync="limit" :left.sync="left" :username="me.username"/>
      </div>
      <div v-for="user in users" :key="user.id">
        <UserItem :me="me" :user="user" :enable.sync="left" @like="like"/>
      </div>
    </div>
  </div>
</template>

<script>
import UserItem from '@/components/UserItem.vue';
import LikesLimit from '@/components/LikesLimit.vue';

export default {
  name: 'UsersList',
  components: {
    UserItem,
    LikesLimit,
  },
  data: () => ({
    users: [],
    me: null,
    limit: 0,
    left: 0,
    logged: false,
    loaded: 0,
  }),
  methods: {
    like(e) {
      this.left = e.left;
      this.limit = e.limit;
    },
  },
  created() {
    this.loaded = 0;

    fetch('/api/session')
      .then(res => res.json())
      .then((res) => {
        if (res.ok) this.me = res.user;
        else this.me = null;
        this.loaded += 1;
      });

    fetch('/api/users')
      .then(res => res.json())
      .then((res) => {
        this.users = res;
        this.loaded += 1;
      });

    fetch('/api/likes_limit')
      .then(res => res.json())
      .then((res) => {
        this.limit = res.limit;
        this.left = res.left;
        this.logged = res.ok;
        this.loaded += 1;
      });
  },
};
</script>
