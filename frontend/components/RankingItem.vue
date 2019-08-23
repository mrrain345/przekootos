<template>
  <div id="panel">
    <div id="left">
      <div id="name">{{id}}. {{user.username}}</div>
      <div id="email">{{user.email}}</div>
      <div id="likes">Votes: {{user.likes}}</div>
    </div>
    <div id="right" @click="click">
      <i class="material-icons">{{expanded ? 'expand_less' : 'expand_more'}}</i>
    </div>
    <div style="clear: both;"></div>
    <div :id="`more-${id}`" class="more" :class="{ active: expanded }">
      <div @DOMSubtreeModified="recalculate">
        <hr/>
        <div v-for="(like, id) in likes" :key="id">
          <strong>{{like.username}}:</strong> {{like.message}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RankingItem',
  props: ['user', 'id'],
  data: () => ({
    expanded: false,
    likes: null,
  }),
  methods: {
    click() {
      this.expanded = !this.expanded;
      this.recalculate();
      if (!this.data) this.getData();
    },
    recalculate() {
      const more = document.querySelector(`#more-${this.id}`);
      const height = document.querySelector(`#more-${this.id}>div`).clientHeight;

      if (this.expanded) {
        more.style.height = `${height + 16}px`;
      } else {
        more.style.height = '0';
      }
    },
    getData() {
      fetch(`/api/users/${this.user.id}/likes`)
        .then(res => res.json())
        .then((res) => {
          this.user.likes = res.count;
          this.likes = res.likes;
        });
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
  user-select: none;
  padding: 4px;
  margin-top: -8px;
  margin-right: -8px;
}

.material-icons {
  font-size: 40px;
  color: #FFFFFF;
  cursor: pointer;
}

.material-icons:active {
  color: #BBDEFB;
}

.more {
  height: 0;
  overflow: hidden;
  color: #FFFFFF;
  transition: all 0.3s;
  transition-timing-function: ease-out;
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

#likes {
  color: #E3F2FD;
  font-size: 18px;
}
</style>
