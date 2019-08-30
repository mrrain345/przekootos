<template>
  <div class="container panel">
    <div class="header">Two-Factor Authentication</div>
    <p>Two-Factor Authentication is <strong>{{enabled ? 'enabled' : 'disabled'}}</strong></p>
    <div class="row">
      <div class="col-8 col-sm-9 col-md-10"></div>
      <div class="col-4 col-sm-3 col-md-2">
        <button v-if="enabled" type="submit" class="btn btn-danger col-12" @click="click">
          Disable
        </button>
        <button v-else type="submit" class="btn btn-success col-12" @click="click">
          Enable
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TwoFactor',
  data: () => ({
    enabled: false,
  }),
  methods: {
    click() {
      if (!this.enabled) this.$router.push({ path: '/profile/authentication' });
      else {
        fetch('/api/session/2fa', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enable: false }),
        })
          .then(res => res.json())
          .then((res) => {
            if (res.ok) this.enabled = res.enable;
          });
      }
    },
  },
  created() {
    fetch('/api/session/2fa')
      .then(res => res.json())
      .then((res) => {
        this.enabled = res.enabled;
      });
  },
};
</script>

<style scoped>
.header {
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 24px;
  letter-spacing: 1.5px;
}
</style>
