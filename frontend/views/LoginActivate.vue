<template>
  <div class="container">
    <div v-if="mode === 1">
      <h1>Activate your account</h1>
      <p>Please check your e-mail</p>
    </div>
    <h1 v-if="mode === 2">Bad registration code</h1>
  </div>
</template>

<script>
export default {
  name: 'login-activate',
  data: () => ({
    mode: 0,
  }),
  mounted() {
    if (!this.$route.query.code) {
      this.mode = 1;
      return;
    }

    const [id, code] = this.$route.query.code.split('.');
    if (!id || !code) {
      this.mode = 2;
      return;
    }

    fetch(`/api/users/${id}/registration_code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registration_code: code }),
    })
      .then(res => res.json())
      .then((res) => {
        if (res.ok) {
          this.$root.$emit('login', true);
          this.$router.push({ path: '/' });
        } else this.mode = 2;
      });
  },
};
</script>

<style scoped>
h1 {
  margin-top: 40px;
  font-size: 40px;
  color: #212121;
}

p {
  font-size: 28px;
  color: #616161;
}
</style>
