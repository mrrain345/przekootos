<template>
  <div id="panel">
    <div id="left">
      <div id="name">{{user.username}}</div>
      <div id="email">{{user.email}}</div>
    </div>
    <div id="right">
      <i class="material-icons noselect" :class="{ active: active }" @click="click">thumb_up</i>
    </div>
    <div style="clear:both;"></div>
  </div>
</template>

<script>
export default {
  name: 'UserItem',
  props: ['id', 'user'],
  data: () => ({
    active: false,
  }),
  methods: {
    click() {
      this.active = !this.active;
    },
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

i.material-icons {
  font-size: 75px;
  color: #cfd8dc;
  cursor: pointer;
  transition: all 0.2s;
}

i.material-icons:hover {
  color: #eceff1;
}

i.material-icons.active {
  color: #4CAF50;
}

i.material-icons.active:hover {
  color: #43a047;
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

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
}
</style>
