<template>
  <div id="form" class="col-10 col-sm-8 col-md-5 col-lg-4">
    <form onsubmit="return false;">
      <div class="row">
        <div class="form-group col-6">
          <label for="fname">First name</label>
          <input type="text" class="form-control" id="fname" v-model="form.fname"
            aria-describedby="fname_err" placeholder="First name"
          />
          <small id="fname_alert" class="form-text">{{alerts.fname}}</small>
        </div>

        <div class="form-group col-6">
          <label for="lname">Last name</label>
          <input type="text" class="form-control" id="lname" v-model="form.lname"
            aria-describedby="lname_err" placeholder="Last name"
          />
          <small id="lname_alert" class="form-text">{{alerts.lname}}</small>
        </div>
      </div>

      <div class="form-group">
        <label for="email">Email address</label>
        <input type="email" class="form-control" id="email" v-model="form.email"
          aria-describedby="email_err" placeholder="Email"
        />
        <small id="email_alert" class="form-text">{{alerts.email}}</small>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" class="form-control" id="password" v-model="form.password"
          aria-describedby="password_alert" placeholder="Password"
        />
        <small id="password_alert" class="form-text">{{alerts.password}}</small>
      </div>

      <div class="form-group">
        <label for="cpassword">Confirm password</label>
        <input type="password" class="form-control" id="cpassword" v-model="form.cpassword"
          aria-describedby="cpassword_alert" placeholder="Confirm password"
        />
        <small id="cpassword_alert" class="form-text">{{alerts.cpassword}}</small>
      </div>

      <div class="row">
        <div class="col-6"></div>
        <div class="col-6">
          <button type="button" class="create-btn btn btn-success d-none d-xl-block"
            @click="create">Create Account
          </button>
          <button type="submit" class="create-btn btn btn-success d-xl-none" @click="create">
            Create
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'RegisterPanel',
  data: () => ({
    form: {
      fname: '',
      lname: '',
      email: '',
      password: '',
      cpassword: '',
    },
    alerts: {
      fname: '',
      lname: '',
      email: '',
      password: '',
      cpassword: '',
    },
  }),
  methods: {
    create() {
      fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.form),
      })
      .then(res => res.json())
      .then((res) => {
        if (res.ok) this.$router.push({ path: '/' });
        else this.setAlerts(res);
      });
    },
    setAlerts(res) {
      this.alerts = {
        fname: '',
        lname: '',
        email: '',
        password: '',
        cpassword: '',
      };

      res.errors.forEach((alert) => {
        this.alerts[alert.target] = alert.message;
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

small {
  color: #f44336;
  font-size: 14px;
}

.create-btn {
  margin-top: 20px;
  width: 100%;
}
</style>
