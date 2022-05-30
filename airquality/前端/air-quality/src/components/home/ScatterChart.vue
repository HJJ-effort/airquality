<template>
  <div class="scatter-box">
    <div class="search-city">
      <!-- 搜索框 -->
      <el-input
        v-model="city"
        placeholder="请输入城市"
        prefix-icon="el-icon-search"
        size="mini"
        @keyup.native.enter="searchCity"
      ></el-input>
      <!-- 选择指标 -->
      <el-select v-model="target" size="mini" @change="change">
        <el-option v-for="item in targetOption" :key="item" :value="item">
        </el-option>
      </el-select>
      <!-- 搜索按钮 -->
      <el-button type="primary" plain size="mini" @click="searchCity"
        >搜索</el-button
      >
    </div>
    <div class="scatter"></div>
    <el-switch v-model="state" @change="changeType"></el-switch>
  </div>
</template>

<script>
export default {
  name: 'ScatterChart',
  data() {
    return {
      city: '北京',
      cityData: [],
      targetOption: ['PM2.5', 'PM10', 'SO2', 'CO', 'NO2', 'O3', 'AQI'],
      target: 'AQI',
      scatterChart: '',
      state: false,
      type: 'scatter3D',
    }
  },
  mounted() {
    this.scatterChart = this.$echarts.init(document.querySelector('.scatter'))
    this.searchCity()
  },
  methods: {
    change() {
      this.drawScatter()
    },
    changeType() {
      if (this.state == false) {
        this.type = 'scatter3D'
      } else {
        this.type = 'line3D'
      }
      this.drawScatter()
    },
    async searchCity() {
      if (this.city == '') {
        return this.$message({
          showClose: true,
          message: `输入不可为空，请重新输入!`,
          type: 'warning',
        })
      }
      let { data: result } = await this.$axios.get(
        `/home/getScatterChart/${this.city}`
      )
      if (result.status) {
        let thisCityArr = result.thisCityArr
        this.cityData = [] // 转换为纯数组
        thisCityArr.map((item) => {
          this.cityData.push([
            item.date.substring(0,10),
            item.ct,
            item.city,
            item.pm25,
            item.pm10,
            item.so2,
            item.co,
            item.no2,
            item.o3,
            item.aqi,
          ])
        })
        this.drawScatter()
      } else {
        return this.$message({
          showClose: true,
          message: result.msg,
          type: 'error',
        })
      }
    },
    drawScatter() {
      let data = this.cityData
      let series = [
        {
          name: this.city,
          type: this.type,
          emphasis: {
            label: {
              show: false,
            },
          },
          dimensions: [
            { name: '日期', type: 'ordinal' },
            { name: '时间', type: 'ordinal' },
            '城市',
            'PM2.5',
            'PM10',
            'SO2',
            'CO',
            'NO2',
            'O3',
            'AQI',
          ],
          encode: {
            x: 0,
            y: 1,
            z: this.target,
          },
        },
      ]
      if (this.type == 'line3D') {
        series[0].lineStyle = {
          color: '#ffaa00',
          width: 3,
        }
      } else {
        series[0].itemStyle = {
          color: '#ffaa00',
        }
      }
      let option = {
        title: {
          text: this.city,
          left: 'left',
          top: 5,
          textStyle: {
            textShadowColor: 'rgba(255, 255, 255, 0.6)',
            textShadowBlur: '3',
            color: '#fff',
          },
          subtext: '近三日历史数据',
          subtextStyle: {
            fontSize: 10,
            color: 'rgba(255, 255, 255, 0.8)',
          },
        },
        tooltip: {
          formatter: (params) => {
            let str = `
              <div>日期：${params.data[0]}</div>
              <div>时间：${params.data[1]}</div>
              <div>${this.target}: ${
              params.data[this.targetOption.indexOf(this.target) + 3]
            }</div>
            `
            return str
          },
        },
        grid3D: {}, // 三维笛卡尔坐标系组件
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
          data: [
            '00:10',
            '01:10',
            '02:10',
            '03:10',
            '04:10',
            '05:10',
            '06:10',
            '07:10',
            '08:10',
            '09:10',
            '10:10',
            '11:10',
            '12:10',
            '13:10',
            '14:10',
            '15:10',
            '16:10',
            '17:10',
            '18:10',
            '19:10',
            '20:10',
            '21:10',
            '22:10',
            '23:10',
          ],
        }, // 三维笛卡尔坐标系中的 y 轴
        zAxis3D: {
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, .5)',
            },
          },
        }, // 三维笛卡尔坐标系中的 z 轴
        dataset: {
          source: data,
        },
        series: series,
      }
      window.addEventListener('resize', () => {
        this.scatterChart.resize()
      })
      if(this.target == 'AQI') {
        option.visualMap = {
          //  是视觉映射组件，用于进行『视觉编码』，也就是将数据映射到视觉元素（视觉通道）。
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
          }
        }
      } else {
        this.scatterChart.clear()
      }
      this.scatterChart.setOption(option)
    },
  },
}
</script>

<style lang="less" scoped>
.scatter-box {
  position: relative;
  width: 100%;
  height: 100%;
  .search-city {
    display: flex;
    justify-content: space-around;
  }
}

.el-input {
  width: 150px;
}

.el-select {
  width: 85px;
}

.scatter {
  width: 100%;
  height: 90%;
}

.el-switch {
  position: absolute;
  bottom: 0px;
  right: 0px;
  // z-index: 100;
}
</style>
