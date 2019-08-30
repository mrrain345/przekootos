<template>
  <div class="panel col-10 col-sm-8 col-md-5 col-lg-4">
    <form onsubmit="return false;">
      <div class="form-group">
        <p id="alert" class="form-text">{{alert}}</p>
      </div>
      <div class="form-group" v-if="!auth_2fa">
        <label for="email">Email address</label>
        <input type="email" class="form-control" id="email"
          v-model="email" placeholder="Email"
        />
      </div>

      <div class="form-group" v-if="!auth_2fa">
        <label for="password">Password</label>
        <input type="password" class="form-control" id="password"
          v-model="password" placeholder="Password"
        />
      </div>

      <div class="form-group" v-if="auth_2fa">
        <label for="token">Authentication code</label>
        <input type="text" class="form-control" id="token"
          v-model="token" placeholder="Authentication code"
        />
      </div>

      <div class="row">
        <div class="col-6">
          <GitHub/>
        </div>
        <div class="col-6">
          <button type="submit" class="login-btn btn btn-success" @click="login">
            Login
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import GitHub from '@/components/GitHub.vue';

export default {
  name: 'LoginPanel',
  components: {
    GitHub,
  },
  data: () => ({
    email: '',
    password: '',
    alert: '',
    auth_2fa: false,
    token: '',
  }),
  methods: {
    login() {
      fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
          token: this.auth_2fa ? this.token : undefined,
        }),
      })
        .then(res => res.json())
        .then((res) => {
          this.alert = '';
          if (res.ok) {
            this.$root.$emit('login', true);
            this.$router.push({ path: '/' });
          } else if (res.code === 1) {
            this.alert = 'Email or password is incorrect';
          } else if (res.code === 2) {
            this.$router.push({ path: '/login/activate' });
          } else if (res.code === 3) {
            this.auth_2fa = true;
          } else if (res.code === 4) {
            this.alert = 'Athentication code is incorrect';
          }
        });
    },
  },
};
</script>

<style scoped>
.panel {
  padding: 40px 20px;
}

label {
  margin-bottom: 2px;
  letter-spacing: 0.5px;
  font-weight: bold;
}

#alert {
  color: #f44336;
  font-size: 18px;
}

.login-btn {
  margin-top: 20px;
  width: 100%;
}
</style>
