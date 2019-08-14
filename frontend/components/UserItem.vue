<template>
  <div id="panel">
    <div id="left">
      <div id="name">{{user.username}}</div>
      <div id="email">{{user.email}}</div>
    </div>
    <div id="right" v-if="display(user)">
      <img id="przekootos" class="noselect" src="/przekootos.png"
        :class="{ active: active }" @click="click"
      />
    </div>
    <div style="clear:both;"></div>
  </div>
</template>

<script>
export default {
  name: 'UserItem',
  props: ['user', 'me'],
  data: () => ({
    active: false,
    loaded: false,
  }),
  methods: {
    click() {
      const lastActive = this.active;
      this.active = !this.active;

      fetch(`/api/users/${this.user.id}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ like: this.active }),
      })
        .then(res => res.json())
        .then((res) => {
          this.active = res.like;
        })
        .catch(() => {
          this.active = lastActive;
        });
    },
    display(user) {
      return this.loaded && this.me !== null && user.id !== this.me;
    },
  },
  beforeMount() {
    if (!this.me) return;

    fetch(`/api/users/${this.user.id}/like`)
      .then(res => res.json())
      .then((res) => {
        this.active = res.like;
        this.loaded = true;
      });
  },
};
</script>

<style scoped>
#panel {
  background-color: #2196F3;
  margin: 20px 0;
  padding: 20px 20px;
  padding-left: 30px;
  border-radius: 5px;
  box-shadow: #0277bd 2px 2px 4px 1px;
}

#left {
  float: left;
}

#right {
  float: right;
  width: 75px;
  height: 75px;
}

#przekootos {
  filter: grayscale(100%) contrast(150%);
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  user-select: none;
}

#przekootos:hover {
  filter: grayscale(100%) contrast(180%);
}

#przekootos.active {
  filter: grayscale(0%) contrast(80%);
}

#przekootos.active:hover {
  filter: grayscale(0%) contrast(100%);
}

#panel:first-child {
  margin-top: 0;
}

#name {
  font-weight: bold;
  font-size: 32px;
  letter-spacing: 2px;
  color: #E3F2FD;
}

#email {
  color: #BBDEFB;
  font-size: 18px;
}

#like {
  border-left: dotted #90CAF9 1px;
}
</style>
