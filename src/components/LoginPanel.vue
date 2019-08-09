<template>
  <div id="form" class="col-10 col-sm-8 col-md-5 col-lg-4">
    <form onsubmit="return false;">
      <div class="form-group">
        <p id="alert" v-if="alert" class="form-text">Email or password is incorrect</p>

        <label for="email">Email address</label>
        <input type="email" class="form-control" id="email"
          v-model="email" placeholder="Email"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" class="form-control" id="password"
          v-model="password" placeholder="Password"
        />
      </div>

      <div class="row">
        <div class="col-6"></div>
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
export default {
  name: 'LoginPanel',
  data: () => ({
    email: '',
    password: '',
    alert: false,
  }),
  methods: {
    login() {
      fetch('/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
        }),
      })
      .then(res => res.json())
      .then((res) => {
        this.alert = !res.ok;
        if (res.ok) {
          this.$root.$emit('login', true);
          this.$router.push({ path: '/' });
        }
      });
    },
  },
};
</script>

<style scoped>
#form {
  background-color: #2196f3;
  border-radius: 5px;
  padding: 40px 20px;
  box-shadow: #0277bd 2px 2px 4px 1px;
}

label {
  color: #263238;
  margin-bottom: 2px;
  letter-spacing: 0.5px;
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
