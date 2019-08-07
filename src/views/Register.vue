<template>
  <div class="container">
    <div class="row">
      <div id="title" class="d-none d-md-block col-md-7 col-lg-8">
        <h1>Przekootos</h1>
        <h3>Create your account!</h3>
      </div>

      <div class="col-1 col-sm-2 d-md-none"></div>
      <div id="form" class="col-10 col-sm-8 col-md-5 col-lg-4">
        <form>
          <div class="row">
            <div class="form-group col-6">
              <label for="fname">First name</label>
              <input type="text" class="form-control" id="fname" aria-describedby="fname_err" placeholder="First name">
              <small id="fname_err" class="form-text text-muted"></small>
            </div>

            <div class="form-group col-6">
              <label for="lname">Last name</label>
              <input type="text" class="form-control" id="lname" aria-describedby="lname_err" placeholder="Last name">
              <small id="lname_err" class="form-text text-muted"></small>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email address</label>
            <input type="email" class="form-control" id="email" aria-describedby="email_err" placeholder="Email">
            <small id="email_err" class="form-text text-muted"></small>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password" aria-describedby="password_err" placeholder="Password">
            <small id="password_err" class="form-text text-muted"></small>
          </div>

          <div class="form-group">
            <label for="cpassword">Confirm password</label>
            <input type="password" class="form-control" id="cpassword" aria-describedby="cpassword_err" placeholder="Confirm password">
            <small id="cpassword_err" class="form-text text-muted"></small>
          </div>
        </form>

        <div class="row">
          <div class="col-6"></div>
          <div class="col-6">
            <button class="create-btn btn btn-success d-none d-xl-block">Create Account</button>
            <button class="create-btn btn btn-success d-xl-none">Create</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'register',
};
</script>

<style scoped>
#title {
  text-align: center;
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

.create-btn {
  margin-top: 20px;
  width: 100%;
}
</style>
