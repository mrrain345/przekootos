<template>
  <div class="container">
    <div class="row">
      <div class="col-1 col-sm-2 d-md-none"></div>
      <div id="form" class="col-10 col-sm-8 col-md-5 col-lg-4">
        <form>
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
              <button type="button" class="login-btn btn btn-success" @click="login">
                Login
              </button>
            </div>
          </div>
        </form>
      </div>

      <div id="title" class="d-none d-md-block col-md-7 col-lg-8">
        <h1>Przekootos</h1>
        <h3>Login to your account!</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
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
        console.log(res);
        this.alert = !res.ok;
      });
    },
  },
  created() {
    fetch('/api/session')
    .then(res => res.json())
    .then((res) => {
      console.log('Session:', res.ok);
    });
  },
};
</script>

<style scoped>
#title {
  text-align: center
}

h1 {
  margin-top: 40px;
  color: #2196f3;
  font-size: 64px;
  letter-spacing: 4px;
  text-shadow: 0px 2px 4px;
}

h3 {
  color: #607d8b;
  font-size: 32px;
  letter-spacing: 0.5px;
}

#form {
  background-color: #2196f3;
  border-radius: 5px;
  padding: 40px 20px;
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
