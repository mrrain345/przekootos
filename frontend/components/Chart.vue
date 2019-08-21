<template>
  <div>
    <div id="chart"></div>
  </div>
</template>

<script>
export default {
  name: 'Chart',
  props: ['users', 'step'],
  data: () => ({
    count: 12,
  }),
  mounted() {
    google.charts.load('current', {'packages':['line']});
    google.charts.setOnLoadCallback(this.drawChart);
  },
  methods: {
    async drawChart() {
      const chart = new google.visualization.DataTable();
      chart.addColumn('date', '');

      const usersData = [];

      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        const data = await fetch(`/api/users/${user.id}/chart?count=${this.count}&step=${this.step}`)
          .then(res => res.json())
          .catch(err => console.log(err));

        const userData = [];
        data.data.forEach(row => {
          userData.push([new Date(row.from), row.count]);
        });
        usersData.push({ id: user.id, username: user.username, data: data.data });
      };

      if (usersData.length === 0) return;

      for (let i = 0; i < usersData.length; i+=1) {
        chart.addColumn('number', usersData[i].username);
      }

      for (let j = 0; j < this.count; j+=1) {
        const row = [new Date(usersData[0].data[j].from)];
        for (let i = 0; i < usersData.length; i+=1) {
          row.push(usersData[i].data[j].count);
        }
        chart.addRows([row]);
      }

      const options = {
        /*chart: {
          title: 'Daily kootoses',
        },*/
        height: 250,
      };

      const gchart = new google.charts.Line(document.getElementById('chart'));
      gchart.draw(chart, google.charts.Line.convertOptions(options));
    },
  },
  watch: {
    step() { this.drawChart() },
  }
}
</script>