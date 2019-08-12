<template>
  <div id="panel">
      <div id="name">{{id}}. {{user.username}}</div>
      <div id="email">{{user.email}}</div>
      <div id="likes">Likes: {{user.likes}}</div>
  </div>
</template>

<script>
export default {
  name: 'RankingItem',
  props: ['user', 'id'],
};
</script>

<style scoped>
#panel {
  background-color: #2196F3;
  margin: 20px 0;
  padding: 20px 20px;
  padding-left: 30px;
  border-radius: 5px;
  box-shadow: #0277bd 2px 2px 4px 1px;
}

#name {
  font-weight: bold;
  font-size: 32px;
  letter-spacing: 2px;
  color: #E3F2FD;
}

#email {
  color: #BBDEFB;
  font-size: 18px;
}

#likes {
  color: #E3F2FD;
  font-size: 18px;
}
</style>
