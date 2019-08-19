<template>
  <div>
    <a :href="`https://github.com/login/oauth/authorize?scope=read:user,user:email&client_id=${client_id}`">GitHub</a>
  </div>
</template>

<script>
export default {
  name: 'GitHub',
  data: () => ({
    client_id: '6f85928125d9b221f454',
  })
}
</script>