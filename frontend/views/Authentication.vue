<template>
  <div id="qrcode">
    <qrcode-vue :value="otpauth" size="300"></qrcode-vue>

    <form onsubmit="return false;">
      <div class="form-group">
        <div v-if="alert" class="alert alert-danger">{{alert}}</div>
        <input type="text" class="form-control" id="token"
          v-model="token" placeholder="Authentication code"
        />
        <button type="submit" class="btn btn-success form-control" @click="click">OK</button>
      </div>
    </form>
  </div>
</template>

<script>
import { authenticator } from 'otplib/otplib-browser';
import QrcodeVue from 'qrcode.vue';

export default {
  name: 'authentication',
  components: {
    QrcodeVue,
  },
  data: () => ({
    otpauth: '',
    token: '',
    alert: '',
    secret: null,
  }),
  methods: {
    click() {
      if (!authenticator.check(this.token, this.secret)) {
        this.alert = 'Bad authentication code';
        this.token = '';
        return;
      }

      fetch('/api/session/2fa', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enable: true,
          secret: this.secret,
          token: this.token,
        }),
      })
        .then(res => res.json())
        .then((res) => {
          if (!res.ok) this.alert = res.message;
          else {
            this.$router.push({ path: '/profile' });
          }
        });
    },
  },
  async created() {
    const email = await fetch('/api/session')
      .then(res => res.json())
      .then((res) => {
        if (!res.ok) return null;
        return res.user.email;
      });

    if (!email) {
      this.$router.push({ path: '/' });
      return;
    }

    this.secret = authenticator.generateSecret();
    this.otpauth = authenticator.keyuri(email, 'Przekootos', this.secret);
  },
};
</script>

<style scoped>
#qrcode {
  width: 300px;
  margin: 0 auto;
}

form {
  margin-top: 15px;
}

button {
  margin-top: 5px;
}
</style>
