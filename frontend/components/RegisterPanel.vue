<template>
  <div class="panel col-10 col-sm-8 col-md-5 col-lg-4">
    <form onsubmit="return false;">
      <div class="row">
        <div class="form-group col-6">
          <label for="fname">First name</label>
          <input type="text" class="form-control" id="fname"
            v-model="form.fname" placeholder="First name"
          />
          <small class="form-text">{{alerts.fname}}</small>
        </div>

        <div class="form-group col-6">
          <label for="lname">Last name</label>
          <input type="text" class="form-control" id="lname"
            v-model="form.lname" placeholder="Last name"
          />
          <small class="form-text">{{alerts.lname}}</small>
        </div>
      </div>

      <div class="form-group">
        <label for="email">Email address</label>
        <input type="email" class="form-control" id="email"
          v-model="form.email" placeholder="Email"
        />
        <small class="form-text">{{alerts.email}}</small>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" class="form-control" id="password"
          v-model="form.password" placeholder="Password"
        />
        <small class="form-text">{{alerts.password}}</small>
      </div>

      <div class="form-group">
        <label for="cpassword">Confirm password</label>
        <input type="password" class="form-control" id="cpassword"
          v-model="form.cpassword" placeholder="Confirm password"
        />
        <small class="form-text">{{alerts.cpassword}}</small>
      </div>

      <div class="row">
        <div class="col-6">
          <GitHub/>
        </div>
        <div class="col-6">
          <button type="submit" class="create-btn btn btn-success d-none d-xl-block"
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
import GitHub from '@/components/GitHub.vue';

export default {
  name: 'RegisterPanel',
  components: {
    GitHub,
  },
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
          if (res.ok) {
            this.$root.$emit('login', true);
            this.$router.push({ path: '/' });
          } else this.setAlerts(res);
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
.panel {
  padding: 40px 20px;
}

label {
  margin-bottom: 2px;
  letter-spacing: 0.5px;
  font-weight: bold;
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
