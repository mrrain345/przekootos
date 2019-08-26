<template>
    <div id="calendar" class="btn-group" role="group">
      <div class="btn-group" role="group" v-if="mode==='day'">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="days"
          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{day}}
        </button>
        <div class="dropdown-menu scrollable-menu" aria-labelledby="days">
          <button class="dropdown-item" v-for="i in getDays()" :key="i"
            :class="{ 'active' : i === day }" @click="change('day', i)">{{i}}
          </button>
        </div>
      </div>

      <div class="btn-group" role="group" v-if="mode==='week'">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown"
          id="weeks" aria-haspopup="true" aria-expanded="false" v-html="printWeek(week)">
        </button>
        <div class="dropdown-menu scrollable-menu" aria-labelledby="weeks">
          <button class="dropdown-item" v-for="(w, i) in weeks" :key="i"
            :class="{ 'active' : i === week.id }" @click="change('week', w)" v-html="printWeek(w)">
          </button>
        </div>
      </div>

      <div class="btn-group" role="group" v-if="mode!=='year' && mode!=='all'">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="months"
          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{months[month-1]}}
        </button>
        <div class="dropdown-menu scrollable-menu" aria-labelledby="months">
          <button class="dropdown-item" v-for="i in 12" :key="i"
            :class="{ 'active' : i === month }" @click="change('month', i)">{{months[i-1]}}
          </button>
        </div>
      </div>

      <div class="btn-group" role="group" v-if="mode!=='all'">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="years"
          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{getYear()}}
        </button>
        <div class="dropdown-menu scrollable-menu" aria-labelledby="years">
          <button class="dropdown-item" v-for="i in 10" :key="i" :class="{ 'active' : i === year }"
            @click="change('year', i)">{{getYear(i)}}
          </button>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Calendar',
  props: ['mode', 'value'],
  data: () => ({
    day: 1,
    week: {},
    month: 1,
    year: 10,
    thisYear: 2019,
    weeks: [],
    months: [
      'January', 'February', 'March',
      'April', 'May', 'June',
      'July', 'August', 'September',
      'October', 'November', 'December',
    ],
  }),
  methods: {
    getDays(month) {
      const m = month || this.month;
      const year = this.getYear();
      const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      if (isLeap && m === 2) return 29;
      return days[m - 1];
    },
    refreshWeeks() {
      const weeks = [];
      const date = new Date(this.getYear(), this.month - 1, 1);

      const lastmonth = (this.month > 1) ? this.month - 1 : 12;
      const day = (date.getDay() === 0) ? 7 : date.getDay();
      const start = (day === 1) ? 1 : this.getDays(lastmonth) - day + 2;
      const end = 8 - day;
      weeks.push({ start, end, id: 0 });

      const days = this.getDays();
      let id = 1;
      for (let i = end + 1; i < days; i += 7) {
        weeks.push({ start: i, end: i + 6, id });
        id += 1;
      }

      if (weeks[weeks.length - 1].end > days) {
        weeks[weeks.length - 1].end -= days;
      }

      this.weeks = weeks;
      [this.week] = weeks;
    },
    printWeek(week) {
      const { start, end, id } = week;

      if (id === 0 && start > 1) return `<span class="gray">${start}</span> - ${end}`;
      if (id === this.weeks.length - 1 && end < 28) return `${start} - <span class="gray">${end}</span>`;
      return `${start} - ${end}`;
    },
    getYear(i) {
      const year = i || this.year;
      return this.thisYear - 10 + year;
    },
    change(t, i) {
      if (t === 'day') this.day = i;
      if (t === 'week') this.week = i;
      if (t === 'month') this.month = i;
      if (t === 'year') this.year = i;

      if (t === 'month' || t === 'year') {
        this.refreshWeeks();
      }

      this.updateTime();
    },
    updateTime() {
      let time;

      if (this.mode === 'day') {
        const from = new Date(this.getYear(), this.month - 1, this.day);
        const to = new Date(this.getYear(), this.month - 1, this.day, 23, 59, 59);
        time = { from, to };
      }

      if (this.mode === 'week') {
        const from = new Date(this.getYear(), this.month - 1, this.week.start);
        const to = new Date(this.getYear(), this.month - 1, this.week.end, 23, 59, 59);
        if (this.week.start > this.week.end) {
          if (this.week.id === 0) {
            from.setMonth(from.getMonth() - 1);
          } else {
            to.setMonth(to.getMonth() + 1);
          }
        }
        time = { from, to };
      }

      if (this.mode === 'month') {
        const from = new Date(this.getYear(), this.month - 1, 1);
        const to = new Date(this.getYear(), this.month - 1, this.getDays(), 23, 59, 59);
        time = { from, to };
      }

      if (this.mode === 'year') {
        const from = new Date(this.getYear(), 0, 1);
        const to = new Date(this.getYear(), 11, 31, 23, 59, 59);
        time = { from, to };
      }

      if (this.mode === 'all') {
        const from = null;
        const to = null;
        time = { from, to };
      }

      this.$emit('input', time);
      return time;
    },
  },
  watch: {
    mode() {
      this.updateTime();
    },
  },
  mounted() {
    const date = new Date();

    this.day = date.getDate();
    this.month = date.getMonth() + 1;
    this.thisYear = date.getFullYear();
    this.refreshWeeks();
    this.week = this.weeks.find(w => w.end >= this.day);
    if (!this.week) this.week = this.weeks[this.weeks.length - 1];
    this.updateTime();
  },
};
</script>

<style>
#calendar .gray {
  color: #9E9E9E;
}

#calendar .active .gray {
  color: #BDBDBD;
}

#calendar .btn .gray {
  color: #BDBDBD;
}
</style>

<style scoped>
#calendar {
  display: flex;
  justify-content: center;
}

.scrollable-menu {
  height: auto;
  max-height: 270px;
  overflow-x: hidden;
}
</style>
