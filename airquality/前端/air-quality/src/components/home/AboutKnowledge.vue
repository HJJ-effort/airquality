<template>
  <el-collapse>
    <el-collapse-item title="空气质量指数">
      <p>
        空气质量（air
        quality）的好坏反映了空气污染程度，它是依据空气中污染物浓度的高低来判断的。空气污染是一个复杂的现象，在特定时间和地点空气污染物浓度受到许多因素影响。来自固定和流动污染源的人为污染物排放大小是影响空气质量的最主要因素之一，其中包括车辆、船舶、飞机的尾气、工业企业生产排放、居民生活和取暖、垃圾焚烧等。城市的发展密度、地形地貌和气象等也是影响空气质量的重要因素。
        空气质量指数（Air Quality
        Index，简称AQI）是定量描述空气质量状况的无量纲指数，针对单项污染物的还规定了空气质量分指数，参与空气质量评价的主要污染物为细颗粒物、可吸入颗粒物、二氧化硫、二氧化氮、臭氧、一氧化碳等六项。
      </p>
    </el-collapse-item>
    <el-collapse-item title="空气质量指数标准">
      <el-table
      size="mini"
      :data="standardData"
      >
      <el-table-column
        prop="limits"
        label="指数范围"
        width="50"
       >
      </el-table-column>
      <el-table-column
        prop="grade"
        label="质量类别"
        width="50"
      >
      </el-table-column>
      <el-table-column
        prop="influence"
        label="对健康影响情况">
      </el-table-column>
      <el-table-column
        prop="suggest"
        label="建议采取措施">
      </el-table-column>
    </el-table>
    </el-collapse-item>
    <el-collapse-item title="PM2.5介绍">
      <p>
        PM2.5即细颗粒物，指环境空气中空气动力学当量直径小于等于 2.5
        微米的颗粒物。它能较长时间悬浮于空气中，其在空气中含量浓度越高，就代表空气污染越严重。虽然PM2.5只是地球大气成分中含量很少的组分，但它对空气质量和能见度等有重要的影响。与较粗的大气颗粒物相比，PM2.5粒径小，面积大，活性强，易附带有毒、有害物质（例如，重金属、微生物等），且在大气中的停留时间长、输送距离远，因而对人体健康和大气环境质量的影响更大。
        2013年2月，全国科学技术名词审定委员会将PM2.5的中文名称命名为细颗粒物。细颗粒物的化学成分主要包括有机碳（OC）、元素碳（EC）、硝酸盐、硫酸盐、铵盐、钠盐（Na+）等。
      </p>
    </el-collapse-item>
    <el-collapse-item title="PM2.5的来源">
      <p>
        虽然自然过程也会产生PM2.5，但其主要来源还是人为排放。人类既直接排放PM2.5，也排放某些气体污染物，在空气中转变成PM2.5。直接排放主要来自燃烧过程。
        PM2.5的来源复杂，成分自然也很复杂。主要成分是元素碳、有机碳化合物、硫酸盐、硝酸盐、铵盐。其它的常见的成分包括各种金属元素，既有钠、镁、钙、铝、铁等地壳中含量丰富的元素，也有铅、锌、砷、镉、铜等主要源自人类污染的重金属元素。
        2000年有研究人员测定了北京的PM2.5来源：尘土占20%；由气态污染物转化而来的硫酸盐、硝酸盐、氨盐各占17%、10%、6%；烧煤产生7%；使用柴油、汽油而排放的废气贡献7%；农作物等生物质贡献6%；植物碎屑贡献1%。有趣的是，吸烟也贡献了1%，不过这只是个粗略的科学估算，并不一定准确。该研究中也测定了北京PM2.5的成分：含碳的颗粒物，硫酸根，硝酸根，铵根加在一起占了重量了69%
        。类似地，1999年测定的上海PM2.5中有41.6%是硫酸铵、硝酸铵，41.4%是含碳的物质。
      </p>
    </el-collapse-item>
    <el-collapse-item title="PM2.5的危害">
      <p>
        虽然细颗粒物只是地球大气成分中含量很少的组分，但它对空气质量和能见度等有重要的影响。与较粗的大气颗粒物相比，细颗粒物粒径小，富含大量的有毒、有害物质且在大气中的停留时间长、输送距离远，因而对人体健康和大气环境质量的影响更大。研究表明，颗粒越小对人体健康的危害越大。细颗粒物能飘到较远的地方，因此影响范围较大。
        细颗粒物对人体健康的危害要更大，因为直径越小，进入呼吸道的部位越深。10μm直径的颗粒物通常沉积在上呼吸道，2μm以下的可深入到细支气管和肺泡。细颗粒物进入人体到肺泡后，直接影响肺的通气功能，使机体容易处在缺氧状态。
      </p>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  created() {
    this.getStandardData()
  },
  data() {
    return {
      standardData: [],
      th: ['指数范围', '质量类别', '对健康影响情况', '建议采取措施'],
      bgc: [
        '#9C0A4E', // 严重
        '#D20040', // 重度
        '#FF401A', // 中度
        '#FFAA00', // 轻度
        '#EFDC31', // 良
        '#43CE17', // 优
      ],
    }
  },
  methods: {
    async getStandardData() {
      let { data: result } = await this.$axios.get(`/home/getStandard`)
      if (result.status) {
        this.standardData = result.standardData
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

<style scoped>
p {
  text-indent: 2em;
  color: #606266;
}


</style>
