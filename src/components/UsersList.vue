<template>
  <table>
    <thead>
      <th>No.</th>
      <th>User</th>
      <th>Email</th>
    </thead>
    <tr v-for="(user, id) in users" :key="id">
      <td>{{ id+1 }}</td>
      <td>{{ user.username }}</td>
      <td>{{ user.email }}</td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'UsersList',
  data: () => ({
    users: [],
  }),
  mounted() {
    fetch('/api/user')
      .then(res => res.json())
      .then((res) => { this.users = res; });
  },
};
</script>

<style scoped>
table {
  margin: 0 auto;
  text-align: left;
}

thead {
  text-align: center;
  background-color: #2196f3;
  color: #e3f2fd;
}

th {
  padding: 5px 7px;
}

td {
  padding: 2px 7px;
}
</style>
