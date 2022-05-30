<template>
  <div>
    <div class="showTime">
      <div class="current-time">
        {{ currentTime }}</div>
      <div class="current-date">
        <div>{{ day }}</div>
        <div>{{ currentDate }}</div>
      </div>
    </div>
  </div>
</template>

<script>
var interval
var dt = new Date()
var days = [
  '星期天',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
]
export default {
  name: 'TimeComponent',
    data() {
      return {
        year: dt.getFullYear(),
        month: dt.getMonth() + 1,
        date: dt.getDate(),
        day: days[dt.getDay()],
        hours: dt.getHours(),
        minutes: dt.getMinutes(),
      }
    },
  mounted() {
    interval = setInterval(() => {
      let dt = new Date();
      this.year = dt.getFullYear()
      this.month = dt.getMonth() + 1
      this.date = dt.getDate()
      this.day = days[dt.getDay()]
      this.hours = dt.getHours()
      this.minutes = dt.getMinutes()
    }, 1000)
  },
  computed: {
    currentTime: function () {
      return this.hours + ':' + this.minutes
    },
    currentDate: function () {
      return this.year + '年' + this.month + '月' + this.date + '日'
    },
  },
  beforeDestroy() {
    clearInterval(interval)
  },
}
</script>

<style lang="less" scoped>
.showTime {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 155px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bolder;
  color: #247890;
  font-size: 5px;
  .current-time {
    font-size: 20px;
  }
}
</style>
