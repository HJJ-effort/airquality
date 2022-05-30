<template>
  <div class="bar-box">
    <div class="select-cities">
      <el-input
        v-model="city1"
        placeholder="请输入城市1"
        prefix-icon="iconfont icon-shouye"
        size="mini"
        @keyup.native.enter="searchCities"
      ></el-input>
      <el-input
        v-model="city2"
        placeholder="请输入城市2"
        prefix-icon="iconfont icon-shouye"
        size="mini"
        @keyup.native.enter="searchCities"
      ></el-input>
      <el-button type="primary" plain size="mini" @click="searchCities"
        >搜索</el-button
      >
    </div>
    <div class="show-bar" :class="{ hide: isHide }">
      <div class="bar"></div>
      <span class="close el-icon-circle-close" @click="close"></span>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.barChart = this.$echarts.init(document.querySelector('.bar'))
  },
  data() {
    return {
      barChart: '',
      city1: '北京',
      city2: '上海',
      cityDatas: [], // 存放两个城市的数据
      isHide: true,
    }
  },
  methods: {
    async searchCities() {
      if (this.city1 == '' && this.city2 == '') {
        return this.$message({
          showClose: true,
          message: '请输入要对比的两个城市',
          type: 'warning',
        })
      }
      if (this.city1 == '' || this.city2 == '') {
        return this.$message({
          showClose: true,
          message: '请在分别在两个输入框中输入城市1和城市2',
          type: 'warning',
        })
      }
      if (this.city1 == this.city2) {
        return this.$message({
          showClose: true,
          message: '请输入两个不同的城市',
          type: 'warning',
        })
      }
      this.cityDatas = [] // 每次都清空this.cityDatas,否则每次查询都会不断插入
      let { data: result } = await this.$axios.get('/home/getBarChart', {
        params: {
          city1: this.city1,
          city2: this.city2,
        },
      })
      if (result.status) {
        if (
          result.twoCities[0].length == 0
        ) {
          return this.$message({
            showClose: true,
            message: '找不到城市1的数据！',
            type: 'error',
          })
        }
         if (
          result.twoCities[1].length == 0
        ) {
          return this.$message({
            showClose: true,
            message: '找不到城市2的数据！',
            type: 'error',
          })
        }
        let data1 = result.twoCities[0]
        let data2 = result.twoCities[1]
        data1.map((item) => {
          this.cityDatas.push([item.date.substring(0,10), item.city, item.aqi])
        })
        data2.map((item) => {
          this.cityDatas.push([item.date.substring(0,10), item.city, item.aqi])
        })
        this.isHide = false
        this.drawBar()
      } else {
        return this.$message({
          showClose: true,
          message: result.msg,
          type: 'error',
        })
      }
    },
    drawBar() {
      let option = {
        title: {
          text: this.city1 + '-' + this.city2,
          left: 'left',
          top: 5,
          textStyle: {
            textShadowColor: 'rgba(255, 255, 255, 0.6)',
            textShadowBlur: '3',
            color: '#fff',
          },
          subtext: '两市近三日历史数据对比',
          subtextStyle: {
            fontSize: 10,
            color: 'rgba(255, 255, 255, 0.8)',
          },
        },
        tooltip: {},
        grid3D: {},
        xAxis3D: {
          // 三维笛卡尔坐标系中的 x 轴
          type: 'category',
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, .5)',
            },
          },
        },
        yAxis3D: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, .5)',
            },
          },
        },
        zAxis3D: {
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, .5)',
            },
          },
        },
        visualMap: {
          min: 0,
          max: 500,
          pieces: [
            { min: 300, max: 500 },
            { min: 201, max: 300 },
            { min: 151, max: 200 },
            { min: 101, max: 150 },
            { min: 51, max: 100 },
            { min: 0, max: 50 },
          ],
          color: [
            '#9C0A4E', // 严重
            '#D20040', // 重度
            '#FF401A', // 中度
            '#FFAA00', // 轻度
            '#EFDC31', // 良
            '#43CE17', // 优
          ],
          textStyle: {
            // 字的颜色
            color: '#fff',
          },
        },
        dataset: { source: this.cityDatas },
        series: [
          {
            name: '注：数据为每日均值',
            type: 'bar3D',
            dimensions: ['日期', '城市', 'AQI'],
            emphasis: {
              label: {
                show: false,
              },
            },
            itemStyle: {
              opacity: 0.5,
            },
          },
        ],
      }
      window.addEventListener('resize', () => {
        this.barChart.resize()
      })
      this.barChart.setOption(option)
    },
    close() {
      this.isHide = true
    },
  },
}
</script>

<style scoped>
.bar-box {
  margin-bottom: 20px;
}

.select-cities {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(33, 110, 215, 0.8);
}
.el-input {
  width: 120px;
}

.show-bar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 540px;
  height: 350px;
  background-color: rgba(21, 1, 54, 0.95);
  z-index: 1000;
  box-sizing: border-box;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 5px 2px rgba(255, 255, 255, 0.3);
  border-radius: 15px;
}

.bar {
  width: 498px;
  height: 308px;
}

.hide {
  display: none;
}

.close {
  position: absolute;
  top: 6px;
  right: 6px;
  cursor: pointer;
  color: #fff;
}
</style>
