<template>
  <div class="container panel">
    <div class="header">Settings</div>
    <form onsubmit="return false;">
      <div class="form-group row">
        <div class="col-12"><label>Change username</label></div>
        <div class="col-8 col-sm-9 col-md-10">
          <input type="text" class="form-control" id="username"
            v-model="username" placeholder="Username"
          />
        </div>
        <div class="col-4 col-sm-3 col-md-2">
        <button type="submit" class="btn btn-success col-12">
          Change
        </button>
        </div>
      </div>
    </form>
    <form onsubmit="return false;">
      <div class="form-group">
        <label>Change password</label>
        <input type="password" class="form-control passwords"
          v-model="password.old" placeholder="Old password"
        />
        <input type="password" class="form-control passwords"
          v-model="password.new" placeholder="New password"
        />
        <input type="password" class="form-control passwords"
          v-model="password.confirm" placeholder="Confirm password"
        />
        <div class="row">
          <div class="col-8 col-sm-9 col-md-10"></div>
          <div class="col-4 col-sm-3 col-md-2">
            <button type="submit" class="passwd-btn btn btn-success col-12">
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
    password: {
      old: '',
      new: '',
      confirm: '',
    },
  }),
  mounted() {
    this.username = this.user.username;
  },
};
</script>

<style scoped>
.header {
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 24px;
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
</style>
