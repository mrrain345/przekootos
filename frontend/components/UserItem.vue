<template>
  <div class="panel">
    <div id="left">
      <div class="username">{{user.username}}</div>
      <div class="email">{{user.email}}</div>
    </div>
    <div id="right" v-if="display(user)">
      <img id="przekootos" class="noselect" src="/przekootos.png"
        :class="{ active: active }" @click="click"
      />
    </div>
    <div id="center" v-if="display(user)">
      <LikeMessage :id="user.id" :display.sync="msgDisplay"
        v-model="message" :message.sync="mesg" @ok="vote()" @cancel="cancel()"
      />
    </div>
    <div style="clear:both;"></div>
  </div>
</template>

<script>
import LikeMessage from '@/components/LikeMessage.vue';

export default {
  name: 'UserItem',
  components: {
    LikeMessage,
  },
  props: ['user', 'me', 'enable'],
  data: () => ({
    active: false,
    msgDisplay: false,
    loaded: false,
    message: '',
    mesg: '',
  }),
  methods: {
    click() {
      if (!this.active && this.enable) this.msgDisplay = !this.msgDisplay;
      else if (this.active) this.vote();
    },
    cancel() {
      this.msgDisplay = false;
      this.message = '';
    },
    vote() {
      const lastActive = this.active;
      this.active = !this.active;

      fetch(`/api/users/${this.user.id}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          like: this.active,
          message: this.message,
        }),
      })
        .then(res => res.json())
        .then((res) => {
          this.active = res.like;
          this.msgDisplay = false;
          this.mesg = res.message;
          this.message = '';
          this.$emit('like', {
            limit: res.limit,
            left: res.left,
          });
        })
        .catch(() => {
          this.active = lastActive;
          this.message = '';
        });
    },
    display(user) {
      return this.loaded && this.me && user.id !== this.me.id;
    },
  },
  beforeMount() {
    if (!this.me) return;

    fetch(`/api/users/${this.user.id}/like`)
      .then(res => res.json())
      .then((res) => {
        this.active = res.like;
        this.mesg = res.message;
        this.loaded = true;
      });
  },
};
</script>

<style scoped>
.panel {
  margin: 20px 0;
  padding-left: 30px;
}

#left {
  float: left;
  max-width: 75%;
}

#center {
  clear: both;
  max-height: 75px;
  margin-right: 20px;
}

#right {
  float: right;
  width: 75px;
  height: 75px;
  max-width: 25%;
}

.email {
  margin-bottom: 10px;
}

@media (min-width: 768px) {
  #center {
    clear: none;
    float: right;
    width: 35%;
    height: 75px;
    margin-right: 20px;
  }

  #left {
    max-width: 50%;
  }

  .email {
    margin-bottom: 0;
  }
}

#przekootos {
  filter: grayscale(100%) contrast(150%);
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  user-select: none;
}

#przekootos:active {
  filter: grayscale(100%) contrast(180%);
}

#przekootos.active {
  filter: grayscale(0%) contrast(80%);
}

#przekootos.active:active {
  filter: grayscale(0%) contrast(100%);
}

#panel:first-child {
  margin-top: 0;
}

#like {
  border-left: dotted #90CAF9 1px;
}
</style>
