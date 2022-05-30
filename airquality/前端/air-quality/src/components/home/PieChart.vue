<template>
  <div class="pie-box">
    <h3 v-if="!isShow">
      <div>暂无今日等级占比数据,</div>
      <div>请点击右侧实时监测搜索</div>
    </h3>
    <div class="pie"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.pieChart = this.$echarts.init(document.querySelector('.pie'))
  },
  watch: {
    '$store.state.currentCityArr': function () {
      this.isShow = true
      this.drawPie()
    },
  },
  data() {
    return {
      pieChart: '',
      cityArr: '',
      isShow: false,
    }
  },
  methods: {
    drawPie() {
      let quality = [0, 0, 0, 0, 0, 0]
      this.cityArr = this.$store.state.currentCityArr
      this.cityArr.map((item) => {
        item.quality == '优质' ? (quality[0] += 1) : quality
        item.quality == '良好' ? (quality[1] += 1) : quality
        item.quality == '轻度污染' ? (quality[2] += 1) : quality
        item.quality == '中度污染' ? (quality[3] += 1) : quality
        item.quality == '重度污染' ? (quality[4] += 1) : quality
        item.quality == '严重污染' ? (quality[5] += 1) : quality
      })
      let data = [
        { name: '优质', value: quality[0] },
        { name: '良好', value: quality[1] },
        { name: '轻度污染', value: quality[2] },
        { name: '中度污染', value: quality[3] },
        { name: '重度污染', value: quality[4] },
        { name: '严重污染', value: quality[5] },
      ]
      let option = {
        title: {
          text: this.$store.state.currentCity,
          left: 'left',
          textStyle: {
            textShadowColor: 'rgba(255, 255, 255, 0.7)',
            textShadowBlur: '2',
            color: '#fff',
          },
          subtext: '今日等级占比',
          subtextStyle: {
            fontSize: 10,
            color: 'rgba(255, 255, 255, .5)',
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            let str = `
              <div>等级：${params.name}</div>
              <div>个数：${params.value}</div>
              <div>占比：${params.percent}%</div>
            `
            return str
          },
        },
        legend: {
          // 竖向布局
          orient: 'vertical',
          left: 'right',
          itemHeight: 12,
          itemGap: 5,
          textStyle: {
            color: '#fff',
            fontSize: 10,
          },
        },
        series: [
          {
            // name: '访问来源',
            type: 'pie',
            radius: '60%',
            emphasis: {
              itemStyle: {
                // 阴影模糊大小
                shadowBlur: 20,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
              },
            },
            label: {
              fontSize: 10,
              color: '#fff',
            },
            data: data,
          },
        ],
      }
      window.addEventListener('resize', () => {
        this.pieChart.resize()
      })
      this.pieChart.setOption(option)
    },
  },
}
</script>

<style scoped>
.pie-box {
  position: relative;
  width: 100%;
  height: 100%;
}

h3 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  padding: 20px 10px;
  text-align: center;
  transform: translate(-50%, -50%);
  color: #E6A23C;
  background-color: #FDF6EC;
  box-sizing: border-box;
}

.pie {
  width: 100%;
  height: 100%;
}
</style>
