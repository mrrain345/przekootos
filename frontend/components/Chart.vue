<template>
  <div>
    <div id="chart"></div>
  </div>
</template>

<script>
export default {
  name: 'Chart',
  props: ['step', 'date'],
  data: () => ({
    init: false,
    count: {
      day: 14,
      week: 8,
      month: 12,
      year: 6,
      all: 12,
    },
  }),
  mounted() {
    google.charts.load('current', { packages: ['line'] });
    google.charts.setOnLoadCallback(this.drawChart);
  },
  methods: {
    getDateTo() {
      if (this.date.to) return this.date.to;
      const date = new Date();
      date.setMonth(date.getMonth() + 1, 1);
      date.setHours(0, 0, 0, 0);
      return date;
    },
    async drawChart() {
      this.init = true;
      const chart = new google.visualization.DataTable();
      chart.addColumn('date', '');
      const to = (this.date.to) ? `&to=${this.date.to.toJSON()}` : '';
      const step = (this.step !== 'all') ? this.step : 'month';
      const query = `count=${this.count[this.step]}&step=${step}${to}`;

      const { users, count } = await fetch(`/api/users/all/chart?${query}`)
        .then(res => res.json())
        .then(res => ({ users: res.charts, count: res.count }))
        .catch(err => console.log(err));

      if (users.length === 0) {
        document.getElementById('chart').innerText = '';
        return;
      }

      for (let i = 0; i < users.length; i += 1) {
        chart.addColumn('number', users[i].username);
      }

      for (let j = 0; j < count; j += 1) {
        const row = [new Date(users[0].data[j].from)];
        for (let i = 0; i < users.length; i += 1) {
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
    step() { if (this.init) this.drawChart(); },
    date() { if (this.init) this.drawChart(); },
  },
};
</script>
