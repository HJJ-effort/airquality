<template>
  <div class="real-time-model">
    <div class="searchCity">
      <el-input
        v-model="city"
        placeholder="请输入城市"
        prefix-icon="el-icon-search"
        size="mini"
        @keyup.native.enter="searchCity"
      ></el-input>
      <el-button type="primary" plain size="mini" @click="searchCity"
        >实时变化监测搜索</el-button
      >
      <div class="lines-box" :class="{ hide: isHide }">
        <el-divider content-position="right">今日历史数据</el-divider>
        <div class="lines"></div>
        <span class="close el-icon-error" @click="close"></span>
      </div>
    </div>
    <p class="notes">
      注：so2、o3、pm2.5、no2、pm10数值单位均为μg/m3，co数值单位为mg/m3
    </p>
  </div>
</template>

<script>
// import SearchCity from './realtime/SearchCity'
export default {
  name: 'RealTime',
  mounted() {
    this.linesChart = this.$echarts.init(document.querySelector('.lines'))
  },
  data() {
    return {
      city: '',
      isHide: true,
      linesChart: '',
      cityArr: '',
      options: ['co', 'so2', 'pm25', 'pm10', 'no2', 'o3', 'aqi'],
    }
  },
  methods: {
    drawLines() {
      let xAxisDataArr = []
      this.cityArr.map((item) => {
        xAxisDataArr.push(item.ct)
      })
      let seriesArr = []
      for (let i = 0; i < this.options.length; i++) {
        seriesArr.push({
          name: this.options[i],
          type: 'line',
          stack: 'datas',
          data: this.cityArr.map((item) => {
            if (this.options[i] == 'aqi') {
              return item.aqi
            } else if (this.options[i] == 'pm25') {
              return item.pm25
            } else if (this.options[i] == 'pm10') {
              return item.pm10
            } else if (this.options[i] == 'no2') {
              return item.no2
            } else if (this.options[i] == 'so2') {
              return item.so2
            } else if (this.options[i] == 'co') {
              return item.co
            } else {
              return item.o3
            }
          }),
        })
      }

      seriesArr[seriesArr.length - 1].markPoint = {
        data: [
          { type: 'max', name: '最大值' },
          { type: 'min', name: '最小值' },
        ],
      }
      seriesArr[seriesArr.length - 1].markLine = {
        data: [{ type: 'average', name: '平均值' }],
      }
      let option = {
        title: {
          text: `${this.city}`,
          subtext: '空气质量指数变化',
          subtextStyle: {
            fontSize: 11,
          },
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: this.options,
          itemHeight: 10,
          itemGap: 5, // 各项间隔
          textStyle: {
            fontSize: 10,
          },
          left: 50,
        },
        grid: {
          width: 360,
          height: 200,
          left: 35,
          top: 70,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
          showTitle: false,
          top: 20,
        },
        xAxis: {
          type: 'category',
          name: '时间',
          boundaryGap: false,
          data: xAxisDataArr,
        },
        yAxis: {
          type: 'value',
        },
        series: seriesArr,
      }
      window.addEventListener('resize', () => {
        this.linesChart.resize()
      })
      this.linesChart.setOption(option)
    },
    close() {
      this.isHide = true
    },
    changeStoreCurrentCityAndCityArr(newCity, newCityArr) {
      this.$store.commit('updateCurrentCity', newCity)
      this.$store.commit('updateCurrentCityArr', newCityArr)
    },
    async searchCity() {
      if (this.city == '') {
        return this.$message({
          showClose: true,
          message: '请输入要搜索的城市',
          type: 'warning',
        })
      }
      let { data: result } = await this.$axios.get(
        `/home/getRealTimeCity/${this.city}`
      )
      if (result.status) {
        this.isHide = false
        this.changeStoreCurrentCityAndCityArr(this.city, result.cityArr)
        this.cityArr = this.$store.state.currentCityArr
        this.drawLines()
      } else {
        return this.$message({
          showClose: true,
          message: result.msg,
          type: 'error',
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.real-time-model {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
p {
  margin: 0;
  padding: 0;
}
.notes {
  width: 115px;
  height: 95px;
  color: #e6a23c;
  font-size: 5px;
  background-color: rgba(155, 155, 155, 0.3);
  box-sizing: border-box;
  padding: 10px;
}

// searchcity zujian
.searchCity {
  width: 150px;
  height: 95px;
  box-sizing: border-box;
  background-color: rgba(155, 155, 155, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 5px 10px;
}

.lines-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 400px;
  background-color: #fff;
  border-radius: 15px;
  z-index: 1000;
  box-sizing: border-box;
  padding: 30px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.3);
}

.lines-box h3 {
  margin-bottom: 20px;
}

.lines {
  width: 438px;
  height: 291px;
}

.hide {
  display: none;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
</style>
