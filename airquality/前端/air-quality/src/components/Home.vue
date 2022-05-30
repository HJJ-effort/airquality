<template>
  <div class="container">
    <header>
      <time-component></time-component>
      <h1>空气质量监测系统</h1>
      <div class="user-buttons">
        <span class="iconfont icon-userbg"></span>
        <span>{{ $route.params.username }}</span>
        <el-dropdown size="mini" @command="functions">
          <span class="el-dropdown-link">
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="about">相关知识</el-dropdown-item>
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
    <main>
      <div class="left-box">
        <div class="panel">
          <scatter-chart></scatter-chart>
        </div>
        <div class="small-panel">
          <pie-chart></pie-chart>
        </div>
      </div>
      <div class="center-box">
        <div class="showNum"><span>地图城市数: </span>{{ cityAmount }}</div>
        <div class="showMap">
          <air-quality-map></air-quality-map>
        </div>
      </div>
      <div class="right-box">
        <div class="panel">
          <bar-chart></bar-chart>
          <cities-top></cities-top>
        </div>
        <div class="small-panel">
          <real-time></real-time>
        </div>
      </div>
    </main>
    <el-drawer
      :with-header="false"
      :visible.sync="drawer"
      :direction="direction"
      :size="550"
    >
      <about-knowledge></about-knowledge>
    </el-drawer>
  </div>
</template>

<script>
import AirQualityMap from './home/AirQualityMap'
import ScatterChart from './home/ScatterChart'
import BarChart from './home/BarChart'
import PieChart from './home/PieChart'
import TimeComponent from './home/TimeComponent'
import RealTime from './home/RealTime'
import CitiesTop from './home/CitiesTop'
import AboutKnowledge from './home/AboutKnowledge'

export default {
  name: 'Home',
  components: {
    AirQualityMap,
    ScatterChart,
    BarChart,
    TimeComponent,
    PieChart,
    RealTime,
    CitiesTop,
    AboutKnowledge,
  },
  created() {
    this.getCityAmount()
  },
  data() {
    return {
      cityAmount: '',
      drawer: false,
      direction: 'ltr',
    }
  },
  methods: {
    functions(command) {
      if (command === 'logout') {
        window.sessionStorage.clear()
        this.$router.push('/login')
      } else {
        this.drawer = true
      }
    },
    async getCityAmount() {
      let { data: result } = await this.$axios.get('/home/getCityAmount')
      if (result.status) {
        this.cityAmount = result.cityAmount
      }
    },
  },
}
</script>

<style lang="less" scoped>
@font-face {
  font-family: 'electronicFont';
  src: url('../assets/font/DS-DIGIT.TTF');
}

.container {
  width: 100%;
  height: 100%;
  background: url('../assets/image/bg.jpg') no-repeat center;
  background-size: 100% 100%;
}

header {
  position: relative;
  height: 80px;
  background: url('../assets/image/head_bg.png') no-repeat center;
  margin-bottom: 10px;
  h1 {
    font-size: 40px;
    color: #fff;
    line-height: 80px;
    text-align: center;
  }
  .user-buttons {
    position: absolute;
    top: 30px;
    right: 10px;
    font-size: 10px;
    color: #fff;
    font-size: 15px;
    & :nth-child(2) {
      margin: 0 2px 0 5px;
    }
  }
}

main {
  display: flex;
  margin: 0 auto;
  margin: 0 10px;
  .left-box,
  .right-box {
    flex: 3;
    .panel {
      height: 345px;
      padding: 5px;
      box-sizing: border-box;
      background: url('../assets/image/line(1).png') rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(33, 110, 215, 0.8);
      box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.2) inset;
      margin-bottom: 10px;
    }
    .small-panel {
      height: 120px;
      padding: 5px;
      box-sizing: border-box;
      background: url('../assets/image/line(1).png') rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(33, 110, 215, 0.8);
      box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.2) inset;
    }
  }

  .center-box {
    flex: 5;
    margin: 0 10px 0;
    // background-color: #fff;
    .showNum {
      position: relative;
      background-color: rgba(255, 255, 255, 0.1);
      padding: 20px;
      text-align: center;
      font-family: 'electronicFont';
      font-size: 35px;
      color: #ffeb7b;
      margin-bottom: 10px;
      span {
        font-size: 25px;
      }
      &::before {
        position: absolute;
        top: 10px;
        left: 10px;
        content: '';
        width: 30px;
        height: 10px;
        border-top: 2px solid rgba(2, 166, 181, 0.9);
        border-left: 2px solid rgba(2, 166, 181, 0.9);
      }
      &::after {
        position: absolute;
        bottom: 10px;
        right: 10px;
        content: '';
        width: 30px;
        height: 10px;
        border-bottom: 2px solid rgba(2, 166, 181, 0.9);
        border-right: 2px solid rgba(2, 166, 181, 0.9);
      }
    }
    .showMap {
      // position: relative;
      height: 390px;
      padding: 5px;
      box-sizing: border-box;
      background: url('../assets/image/line(1).png') rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(33, 110, 215, 0.8);
      box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.2) inset;
    }
  }
}

.el-drawer {
  p {
    text-indent: 2em;
    padding: 0 20px;
    font-size: 14px;
  }
}
</style>
