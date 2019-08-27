<template>
  <div class="panel">
    <div id="left">
      <div class="username">{{id}}. {{user.username}}</div>
      <div class="email">{{user.email}}</div>
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
          <strong data-toggle="tooltip" :title="like.email">
            {{like.username}}{{like.message ? ':' : ''}}
          </strong>
          {{like.message}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RankingItem',
  props: ['user', 'id', 'date'],
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
      let query = (this.date.from || this.date.to) ? '?' : '';
      if (this.date.from) query += `from=${this.date.from.toJSON()}`;
      if (this.date.from && this.date.to) query += '&';
      if (this.date.to) query += `to=${this.date.to.toJSON()}`;

      fetch(`/api/users/${this.user.id}/likes${query}`)
        .then(res => res.json())
        .then((res) => {
          this.user.likes = res.count;
          this.likes = res.likes;
        });
    },
  },
  watch: {
    date() {
      this.expanded = false;
      this.likes = false;
    },
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
  letter-spacing: 0.5px;
  transition: all 0.3s;
  transition-timing-function: ease-out;
}

.more strong {
  color: #E3F2FD;
  letter-spacing: 1px;
}

#likes {
  color: #E3F2FD;
  font-size: 18px;
}
</style>
