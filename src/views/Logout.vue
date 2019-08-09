<template>
  <div></div>
</template>

<script>
export default {
  name: 'logout',
  created() {
    fetch('/api/session', { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        this.$root.$emit('login', false);
        this.$router.push({ path: '/' });
      });
  },
};
</script>
