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
    google.charts.load('current', { packages: ['line'] });
    google.charts.setOnLoadCallback(this.drawChart);
  },
  methods: {
    async drawChart() {
      const chart = new google.visualization.DataTable();
      chart.addColumn('date', '');

      const users = await fetch(`/api/users/all/chart?count=${this.count}&step=${this.step}`)
        .then(res => res.json())
        .then(res => res.charts)
        .catch(err => console.log(err));

      console.log(users);
      if (users.length === 0) return;

      for (let i = 0; i < users.length; i += 1) {
        chart.addColumn('number', users[i].username);
      }

      for (let j = 0; j < this.count; j += 1) {
        const row = [new Date(users[0].data[j].from)];
        for (let i = 0; i < users.length; i += 1) {
          console.log(`[${i}, ${j}]`, users[i].data[j]);
          row.push(users[i].data[j].count);
        }
        chart.addRows([row]);
      }

      const options = {
        height: 250,
      };

      const gchart = new google.charts.Line(document.getElementById('chart'));
      gchart.draw(chart, google.charts.Line.convertOptions(options));
    },
  },
  watch: {
    step() { this.drawChart(); },
  },
};
</script>
