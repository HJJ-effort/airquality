<template>
  <div class="top-table">
    <div class="bestAndWorst">
      <span class="refresh el-icon-refresh" @click="refreshData"></span>
      <span class="table-btn el-icon-menu" @click="openTableBox"></span>
      <div class="best">
        <h3>全国空气质量最佳前10排名</h3>
        <table>
          <tr>
            <th v-for="(item, index) in bestTop10" :key="index">
              {{ item.num }}
            </th>
          </tr>
          <tr>
            <td v-for="(item, index) in bestTop10" :key="index">
              <span
                class="city-btn"
                @mouseover="getTopCityData(item, $event)"
                @mouseout="refreshHide = true"
                >{{ item.city }}</span
              >
            </td>
          </tr>
        </table>
      </div>
      <div class="worst">
        <h3>全国空气质量最差前10排名</h3>
        <table>
          <tr>
            <th v-for="(item, index) in worstTop10" :key="index">
              {{ item.num }}
            </th>
          </tr>
          <tr>
            <td v-for="(item, index) in worstTop10" :key="index">
              <span
                class="city-btn"
                @mouseover="getTopCityData(item, $event)"
                @mouseout="refreshHide = true"
                >{{ item.city }}</span
              >
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="show-guage" :class="{ hide: refreshHide }" :style="moveStyle">
      <div class="gauge"></div>
      <ul>
        <li>{{ 'PM2.5: ' + item.pm25 + 'μg/m3' }}</li>
        <li>{{ 'PM10: ' + item.pm10 + 'μg/m3' }}</li>
        <li>{{ 'SO2: ' + item.so2 + 'μg/m3' }}</li>
        <li>{{ 'CO: ' + item.co + 'mg/m3' }}</li>
        <li>{{ 'NO2: ' + item.no2 + 'μg/m3' }}</li>
        <li>{{ 'O3: ' + item.o3 + 'μg/m3' }}</li>
      </ul>
    </div>
    <div class="table-box" :class="{ hide: tableHide }">
      <span class="close el-icon-error" @click="close"></span>
      <div class="input-and-table">
        <el-input
          v-model="city"
          placeholder="请输入城市"
          prefix-icon="el-icon-search"
          style="width: 140px"
          @keyup.native.enter="searchCity"
        ></el-input>
        <el-table
          :data="allTop"
          style="width: 140px"
          height="240"
          @row-click="clickTable"
        >
          <el-table-column prop="num" label="排名" width="50px">
          </el-table-column>
          <el-table-column prop="city" label="城市" width="80px">
          </el-table-column>
        </el-table>
      </div>
      <el-carousel height="300px" :autoplay="false" ref="carousel">
        <el-carousel-item>
          <div class="pie2D"></div>
        </el-carousel-item>
        <el-carousel-item>
          <h3 v-if="thisCityData.length == 0">
            <div>暂无城市实时数据</div>
            <div>请点击左侧表格中城市项</div>
          </h3>
          <div class="bar2D" :class="{ opacityEqual1: opacityEqual1 }"></div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.getData()
  },
  mounted() {
    this.gaugeChart = this.$echarts.init(document.querySelector('.gauge'))
    this.bar2DChart = this.$echarts.init(document.querySelector('.bar2D'))
    this.pie2DChart = this.$echarts.init(document.querySelector('.pie2D'))
  },
  watch: {
    allTop: function (newData, oldData) {
      this.drawPie2D()
    },
  },
  data() {
    return {
      allTop: [],
      bestTop10: '',
      worstTop10: '',
      gaugeChart: '',
      bar2DChart: '',
      pie2DChart: '',
      refreshHide: true,
      tableHide: true,
      moveStyle: {
        top: '',
        left: '',
      },
      item: '',
      city: '',
      opacityEqual1: false,
      bar2Ddata: [],
      thisCityData: [],
    }
  },
  methods: {
    // tablebox的显示
    openTableBox() {
      this.tableHide = false
      this.opacityEqual1 = true
    },
    // 查找input
    searchCity() {
      let result = this.allTop.filter((item) => {
        return item.city == this.city
      })
      if (result.length) {
        this.thisCityData = result[0]
        this.bar2Ddata = [
          result[0].aqi,
          result[0].pm2_5,
          result[0].pm10,
          result[0].so2,
          result[0].co,
          result[0].no2,
          result[0].o3,
        ]
        this.$refs.carousel.setActiveItem(1)
        this.drawBar2D()
      } else {
        return this.$message({
          showClose: true,
          message: '找不到该城市数据或您输入错误',
          type: 'error',
        })
      }
    },
    // 仪表盘
    getTopCityData(item, event) {
      this.item = item
      this.refreshHide = false
      this.moveStyle.top = event.pageY - 100 + 'px'
      this.moveStyle.left = event.pageX - 150 + 'px'
      let option = {
        title: {
          text: item.city + 'AQI',
          bottom: '15px',
          left: 'center',
          textStyle: {
            textShadowColor: 'rgba(255, 255, 255, 0.3)',
            textShadowBlur: '1',
            color: '#fff',
            fontSize: 13,
          },
          subtext: item.aqi,
          subtextStyle: {
            fontSize: 15,
            color: 'rgba(255, 255, 255, .9)',
          },
        },
        series: [
          {
            type: 'gauge',
            startAngle: 240,
            endAngle: -60,
            min: 0,
            max: 500,
            splitNumber: 20, // 分隔段数
            axisLine: {
              // 轴线相关
              lineStyle: {
                width: 3,
                color: [
                  [0.1, '#43CE17'],
                  [0.2, '#EFDC31'],
                  [0.3, '#FFAA00'],
                  [0.4, '#FF401A'],
                  [0.6, '#D20040'],
                  [1, '#9C0A4E'],
                ],
              },
            },
            axisTick: {
              // 刻度样式
              // length: 6, // 刻度线长度
              lineStyle: {
                color: 'auto',
                width: 1,
              },
            },
            splitLine: {
              // 分割线
              lineStyle: {
                color: 'auto',
              },
            },
            axisLabel: {
              show: false,
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: item.aqi,
              },
            ],
          },
        ],
      }
      window.addEventListener('resize', () => {
        this.gaugeChart.resize()
      })
      this.gaugeChart.setOption(option)
    },
    // 把点击表格的行传入作为柱状图的数据
    clickTable(row) {
      this.thisCityData = row
      this.bar2Ddata = [
        row.aqi,
        row.pm2_5,
        row.pm10,
        row.so2,
        row.co,
        row.no2,
        row.o3,
      ]
      this.drawBar2D()
      // 跳转到柱状图页面
      this.$refs.carousel.setActiveItem(1)
    },
    // 柱状图渲染
    drawBar2D() {
      this.opacityEqual1 = true
      let series = []
      series.push({
        name: '实时数据',
        type: 'bar',
        dimensions: ['AQI', 'PM2.5', 'PM10', 'SO2', 'CO', 'NO2', 'O3'],
        data: this.bar2Ddata,
      })
      let option = {
        title: {
          text:
            this.thisCityData.city +
            '-排名' +
            this.thisCityData.num +
            '-' +
            this.thisCityData.quality,
          subtext: '时间： ' + this.thisCityData.ct.slice(0, 16),
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          // boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['AQI', 'PM2.5', 'PM10', 'SO2', 'CO', 'NO2', 'O3'],
        },
        series: series,
      }
      window.addEventListener('resize', () => {
        this.bar2DChart.resize()
      })
      this.bar2DChart.setOption(option)
    },
    // 饼图渲染
    drawPie2D() {
      let quality = [0, 0, 0, 0, 0, 0]
      this.allTop.map((item) => {
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
          text: '今日全国空气质量等级',
          left: 'left',
          textStyle: {
            color: '#727477',
          },
          subtext: '城市总数' + this.allTop.length,
          subtextStyle: {
            fontSize: 13,
            // color: 'rgba(0, 0, 0, .5)',
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
          // orient: 'vertical',
          top: 50,
          left: 'center',
          itemWidth: 20,
          itemHeight: 13,
          itemGap: 3,
          textStyle: {
            fontSize: 10,
          },
        },
        series: [
          {
            // name: '访问来源',
            type: 'pie',
            radius: '70%',
            top: 100,
            emphasis: {
              itemStyle: {
                // 阴影模糊大小
                shadowBlur: 20,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
              },
            },
            label: {
              fontSize: 10,
            },
            data: data,
          },
        ],
      }
      window.addEventListener('resize', () => {
        this.pie2DChart.resize()
      })
      this.pie2DChart.setOption(option)
    },
    close() {
      this.tableHide = true
      this.opacityEqual1 = false
    },
    refreshData() {
      this.getData()
      return this.$message({
        showClose: true,
        message: '刷新数据成功',
        type: 'success',
      })
    },
    async getData() {
      await this.$axios
        .get(
          `/home/getTop`
        )
        .then((res) => {
          // 处理请求
          let result = res.data.data
          console.log(result);
          this.allTop = result
          let bestTop10 = []
          let worstTop10 = []
          for (let i = 0; i < 10; i++) {
            bestTop10.push({
              num: result[i].num,
              city: result[i].city,
              aqi: result[i].aqi,
              pm25: result[i].pm25,
              pm10: result[i].pm10,
              so2: result[i].so2,
              co: result[i].co,
              no2: result[i].no2,
              o3: result[i].o3,
            })
          }
          for (let i = result.length - 1; i > result.length - 1 - 10; i--) {
            worstTop10.push({
              num: result[i].num,
              city: result[i].city,
              aqi: result[i].aqi,
              pm25: result[i].pm2_5,
              pm10: result[i].pm10,
              so2: result[i].so2,
              co: result[i].co,
              no2: result[i].no2,
              o3: result[i].o3,
            })
          }
          console.log(bestTop10);
          this.bestTop10 = bestTop10
          this.worstTop10 = worstTop10
        })
    },
  },
}
</script>

<style lang="less" scoped>
.top-table {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 265px;
}

.bestAndWorst {
  position: relative;
}

.refresh {
  position: absolute;
  top: 5px;
  right: 5px;
  color: #82868d;
  font-weight: bolder;
  cursor: pointer;
  transition: all 0.1s;
}

.refresh:hover {
  color: #409eff;
}

.refresh:active {
  transform: rotate(90deg);
}

.table-btn {
  position: absolute;
  top: 135px;
  right: 5px;
  color: #82868d;
  cursor: pointer;
  transition: all 0.1s;
}

.table-btn:hover {
  color: #409eff;
}

h3 {
  color: #fff;
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.7);
}

.best,
.worst {
  width: 100%;
  height: 130px;
}

table {
  box-sizing: border-box;
  text-align: center;
  font-size: 5px;
}

.best th {
  width: 29.6px;
  box-sizing: border-box;
  color: rgb(47, 165, 12);
  border: 1px solid rgb(47, 165, 12);
}

.best td {
  width: 29.6px;
  height: 82px;
  box-sizing: border-box;
  border: 1px solid rgb(47, 165, 12);
  color: rgb(47, 165, 12);
  font-weight: bolder;
}

.worst th {
  width: 29.6px;
  box-sizing: border-box;
  color: rgb(194, 110, 15);
  border: 1px solid rgb(194, 110, 15);
}

.worst td {
  width: 29.6px;
  height: 82px;
  box-sizing: border-box;
  border: 1px solid rgb(194, 110, 15);
  color: rgb(194, 110, 15);
  font-weight: bolder;
}

.city-btn {
  cursor: pointer;
  transition: all 0.3s;
}

.best .city-btn:hover {
  color: rgb(81, 221, 38);
}

.worst .city-btn:hover {
  color: rgb(240, 149, 46);
}

.show-guage {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 130px;
  height: 220px;
  z-index: 1000;
}

.gauge {
  width: 120px;
  height: 120px;
  background-color: rgba(0, 4, 31, 0.5);
  border-radius: 50%;
  box-sizing: border-box;
  box-shadow: 0 0 5px 2px rgba(255, 255, 255, 0.3);
  margin-bottom: 10px;
}

.show-guage ul {
  box-sizing: border-box;
  padding-left: 20px;
  padding: 10px 5px 10px 20px;
  background-color: rgba(0, 4, 31, 0.5);
  box-shadow: 0 0 5px 2px rgba(255, 255, 255, 0.3);
  font-size: 5px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: rgba(255, 255, 255, 0.3);
}

.hide {
  display: none;
}

.close {
  position: absolute;
  top: 7px;
  right: 7px;
  cursor: pointer;
  z-index: 1000;
}

.table-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.input-and-table {
  position: relative;
  height: 340px;
  padding: 20px;
  box-sizing: border-box;
  .el-input {
    margin-bottom: 20px;
  }
  .el-table {
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid #e0dce3;
    box-shadow: 0 0 5px 1px rgba(255, 255, 255, 0.3);
  }
}

.el-carousel {
  position: absolute;
  right: 20px;
  top: 20px;
  width: 400px;
  height: 300px;
  h3 {
    width: 100%;
    height: 100%;
    padding: 130px 20px 20px;
    text-align: center;
    color: #e6a23c;
    background-color: #fdf6ec;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #e0dce3;
  }
}
.pie2D {
  width: 400px;
  height: 300px;
  padding: 10px;
  border-radius: 4px;
  box-sizing: border-box;
  border: 1px solid #e0dce3;
  box-shadow: 0 0 5px 1px rgba(255, 255, 255, 0.3);
}
.bar2D {
  width: 400px;
  height: 300px;
  padding: 10px;
  border-radius: 4px;
  box-sizing: border-box;
  border: 1px solid #e0dce3;
  box-shadow: 0 0 5px 1px rgba(255, 255, 255, 0.3);
  opacity: 0;
  transition: all 4s;
}

.opacityEqual1 {
  opacity: 1;
}

</style>
