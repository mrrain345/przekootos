<template>
</template>

<script>
export default {
  name: 'logout',
  created() {
    fetch('/api/session', { method: 'DELETE' })
    .then(res => res.json())
    .then((res) => {
      this.$router.push({ path: "/" });
    });
  },
}
</script>