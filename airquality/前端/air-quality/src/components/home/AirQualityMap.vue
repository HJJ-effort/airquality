<template>
  <div class="map-box">
    <div class="date-picker-box">
      <el-date-picker
        id="date-picker"
        type="date"
        placeholder="选择日期获取某日AQI"
        size="small"
        v-model="date"
        value-format="yyyy-MM-dd"
        @change="changeDate"
      >
      </el-date-picker>
    </div>
    <div class="tip">
       注：该图数据为该日所有数据求平均所得
    </div>
    <div class="map"></div>
  </div>
</template>

<script>
import '../../assets/map/china'

export default {
  data() {
    return {
      mapChart: '',
      date: '',
      datas: [], // 数据库返回的所有数据
      arr: [], // 要交给series.data的数据
      optionTitle: '全国主要城市空气质量',
    }
  },
  mounted() {
    this.mapChart = this.$echarts.init(document.querySelector('.map'))
    this.drawMap()
  },
  methods: {
    async changeDate() {
      let { data: result } = await this.$axios.get(
        `/home/getMapData/${this.date}`
      )
      if (result.status) {
        this.optionTitle = this.date + '全国主要空气质量'
        this.datas = result.datas
        let arr = []
        this.datas.map((item) => {
          arr.push([item.x, item.y, item.aqi])
        })
        this.arr = arr
        this.drawMap()
      } else {
        return this.$message({
          showClose: true,
          message: result.msg,
          type: 'warning',
        })
      }
    },
    drawMap() {
      let series = []
      if (this.arr.length) {
        series.push({
          type: 'bar3D',
          coordinateSystem: 'geo3D', // 系列中使用的坐标其选项为geo
          barSize: 0.8, //柱子粗细
          emphasis: {
            label: {
              show: false,
            },
          },
          shading: 'lambert',
          minHeight: 1,
          data: this.arr,
        })
      }
      let option = {
        title: {
          text: this.optionTitle,
          left: 'center',
          top: '90px',
          textStyle: {
            color: '#fff',
          },
        },
        tooltip: {
          formatter: (params) => {
            let result = this.datas.filter((item) => {
              return item.x == params.data[0] && item.y == params.data[1]
            })
            let str = `
                <div>城市: ${result[0].city}</div>
                <div>AQI: ${result[0].aqi}</div>
            `
            return str
          },
        },
        geo3D: {
          // 地理坐标系组件 用于绘制地图  要加入地图文件
          map: 'china',
          instancing: true, // 提高效率
          emphasis: {
            label: {
              show: true,
              color: 'rgba(255, 255 ,255 , .3)',
              fontSize: 10,
            },
            itemStyle: {
              color: 'rgba(45,46,50,.3)',
            },
          },
          shading: 'lambert', // lambert着色  表现光照带来明暗
          itemStyle: {
            // 地图样式
            color: 'rgba(7,16,54,.3)',
            borderWidth: 1,
            borderColor: '#949496',
          },
          viewControl: {
            // 控制旋转或者平移
            panMouseButton: 'left', // 开启平移操作
            rotateMouseButton: 'right', // 开启右键旋转操作
            damping: 0.8, // 迟滞影子 拖动的惯性
          },
          silent: true, 
        },
        visualMap: {
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
            color: '#fff',
          },
        },
        series: series,
      }
      window.addEventListener('resize', () => {
        this.mapChart.resize()
      })
      this.mapChart.setOption(option)
    },
  },
}
</script>

<style lang="less" scoped>
.map-box {
  position: relative;
  width: 100%;
  height: 100%;
}

.date-picker-box {
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 10;
}

.map {
  width: 100%;
  height: 100%;
}

.tip {
  position: absolute;
  bottom: 5px;
  right: 5px;
  color: #f39b17;
  font-weight: bolder;
  font-size: 5px;
  text-shadow: 0 0 3px rgba(255, 255, 255, .3);
  z-index: 1000;
}
</style>
