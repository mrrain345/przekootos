<template>
  <div class="container panel">
    <div class="header">History</div>
    <div class="expand" v-if="likes && likes.length > likesShow" @click="click">
      <i class="material-icons">{{expanded ? 'expand_less' : 'expand_more'}}</i>
    </div>
    <div style="clear: both;"></div>
    <div class="history-table" @DOMSubtreeModified="recalculate">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col" class="td-left">Time</th>
            <th scope="col">Username</th>
            <th scope="col" class="td-right">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(like, id) in likes"
            :key="id">
            <td class="td-left">{{printDate(like.timestamp)}}</td>
            <td class="td-middle">
              <span data-toggle="tooltip" :title="like.email">{{like.username}}</span>
            </td>
            <td class="td-right">{{like.message}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'History',
  data: () => ({
    likes: null,
    likesShow: 4,
    expanded: false,
  }),
  methods: {
    click() {
      this.expanded = !this.expanded;
      this.recalculate();
    },
    printDate(date) {
      const fixed = v => ((v.toString().length === 1) ? `0${v}` : v);
      const d = new Date(date);
      const day = fixed(d.getDate());
      const month = fixed(d.getMonth() + 1);
      const year = d.getFullYear();
      const hour = fixed(d.getHours());
      const min = fixed(d.getMinutes());
      return `${day}.${month}.${year} ${hour}:${min}`;
    },
    recalculate() {
      const table = document.querySelector('.history-table');
      const rows = document.querySelectorAll('table tr');
      const show = (this.likesShow < this.likes.length) ? this.likesShow : this.likes.length;
      const count = this.expanded ? this.likes.length : show;
      if (rows.lenth === 1) table.style.height = `${rows[0].clientHeight}px`;
      else table.style.height = `${rows[0].clientHeight + rows[1].clientHeight * count}px`;
    },
  },
  created() {
    fetch('/api/users/me/likes')
      .then(res => res.json())
      .then((res) => {
        this.likes = res.likes;
      });
  },
};
</script>

<style scoped>
.panel {
  padding: 0;
}

.header {
  padding: 20px;
  font-weight: bold;
  font-size: 24px;
  float: left;
  letter-spacing: 1.5px;
}

.expand {
  float: right;
  user-select: none;
  margin: 16px;
  width: 40px;
  height: 40px;
}

.material-icons {
  font-size: 40px;
  color: #FFFFFF;
  cursor: pointer;
}

.material-icons:active {
  color: #BBDEFB;
}

.history-table {
  transition: all 0.3s;
  transition-timing-function: ease-out;
  overflow: hidden;
}

.table {
  color: #E3F2FD;
}

th {
  letter-spacing: 1px;
}

.td-left {
  padding-left: 20px;
}

.td-middle {
  font-weight: bold;
  letter-spacing: 0.5px;
}

.td-right {
  padding-right: 20px;
}
</style>
