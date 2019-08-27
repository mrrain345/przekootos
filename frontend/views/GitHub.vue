<template>
  <pre>
    {{JSON.stringify(output)}}
  </pre>
</template>

<script>
export default {
  name: 'github',
  data: () => ({
    output: undefined,
  }),
  beforeMount() {
    fetch(`/api/login/github?code=${this.$route.query.code}`)
      .then(res => res.json())
      .then((res) => {
        if (res.error) {
          console.error(`[${res.error}] ${res.error_description}`);
          this.$router.push({ path: '/' });
        } else {
          this.$root.$emit('login', true);
          this.$router.push({ path: '/' });
        }
      })
      .catch(err => console.log(err));
  },
};
</script>
