<template>
  <div class="container panel">
    <div class="header">Settings</div>
    <form onsubmit="return false;">
      <div class="form-group row">
        <div class="col-12"><label>Change username</label></div>
        <div class="col-12">
          <div class="alert alert-success" v-if="username_changed">Username changed.</div>
        </div>
        <div class="col-8 col-sm-9 col-md-10">
          <input type="text" class="form-control" id="username"
            v-model="username" placeholder="Username" @input="username_changed = false"
          />
        </div>
        <div class="col-4 col-sm-3 col-md-2">
        <button type="submit" class="btn btn-success col-12"
          :disabled="!validUsername()" @click="sendUsername">Change
        </button>
        </div>
      </div>
    </form>
    <form onsubmit="return false;">
      <div class="form-group">
        <label>{{ has_password ? 'Change password' : 'Set password'}}</label>
        <div class="alert alert-success" v-if="password_changed === 1">Password changed.</div>
        <div class="alert alert-success" v-if="password_changed === 2">Password set.</div>
        <input type="password" class="form-control passwords" v-if="has_password"
          v-model="password.old" placeholder="Old password"
        />
        <small class="form-text">{{alerts.password}}</small>
        <input type="password" class="form-control passwords"
          v-model="password.new" placeholder="New password"
        />
        <small class="form-text">{{alerts.new_password}}</small>
        <input type="password" class="form-control passwords"
          v-model="password.confirm" placeholder="Confirm password"
        />
        <small class="form-text">{{alerts.confirm_password}}</small>
        <div class="row">
          <div class="col-8 col-sm-9 col-md-10"></div>
          <div class="col-4 col-sm-3 col-md-2">
            <button type="submit" class="passwd-btn btn btn-success col-12" @click="sendPassword">
              Change
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  props: ['user'],
  data: () => ({
    username: '',
    has_password: null,
    username_changed: false,
    password_changed: 0,
    password: {
      old: '',
      new: '',
      confirm: '',
    },
    alerts: {
      password: '',
      new_password: '',
      confirm_password: '',
    },
  }),
  methods: {
    validUsername() {
      return this.username.length >= 3 && this.username !== this.user.username;
    },
    setAlerts(errors) {
      this.alerts = { password: '', new_password: '', confirm_password: '' };
      this.password_changed = 0;
      this.username_changed = false;
      if (!errors) return;
      errors.forEach((alert) => {
        this.alerts[alert.target] = alert.message;
      });
    },
    sendUsername() {
      this.password_changed = 0;
      fetch('/api/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.username,
        }),
      })
        .then(res => res.json())
        .then((res) => {
          this.username_changed = res.ok;
          if (res.ok) this.$emit('update:user', res.user);
        });
    },
    sendPassword() {
      const data = {
        password: (this.has_password) ? this.password.old : undefined,
        new_password: this.password.new,
        confirm_password: this.password.confirm,
      };

      fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(res => res.json())
        .then((res) => {
          if (res.ok) {
            this.setAlerts();
            this.password_changed = (this.has_password ? 1 : 2);
            this.has_password = true;
            this.password = { old: '', new: '', confirm: '' };
            this.$emit('update:user', res.user);
          } else this.setAlerts(res.errors);
        });
    },
  },
  created() {
    this.username = this.user.username;

    fetch('/api/users/me/password')
      .then(res => res.json())
      .then((res) => {
        this.has_password = res.has_password;
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

.passwords{
  margin-bottom: 5px;
}

.passwd-btn {
  margin-top: 15px;
}

label {
  font-size: 20px;
  margin-top: 10px;
}

small {
  color: #f44336;
  font-size: 14px;
}
</style>
