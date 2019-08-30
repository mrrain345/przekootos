<template>
  <div>
    AUTHENTICATOR
  </div>
</template>

<script>
import { authenticator } from 'otplib/otplib-browser';

export default {
  name: 'authentication',
  mounted() {
    const secret = authenticator.generateSecret();
    const user = 'mc.rain345@gmail.com';
    const service = 'Przekootos';

    const otpauth = authenticator.keyuri(user, service, secret);
    console.log(otpauth);
  },
};
</script>
