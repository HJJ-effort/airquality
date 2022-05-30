const Router = require('koa-router')
const home = new Router();
const db = require('../utils/db');

// 地图
home.get('/getMapData/:date', async (ctx) => {
  let dt = new Date()
  let year = dt.getFullYear()
  let month = dt.getMonth() + 1
  let date = dt.getDate()
  month < 10 ? month = '0' + month : month
  date < 10 ? date = '0' + date : date
  let dateStr = `${year}-${month}-${date}`
  let datas
  if (ctx.params.date == dateStr) { // 如果是今天则取平均值
    let searchDatas = `
      select  city_data.city as city, city_x as x, city_y as y , floor(avg(aqi)) as aqi from city_data
      inner join city on city.city_name = city_data.city 
      where date= '${ctx.params.date}' GROUP BY city
    `
    datas = await new Promise((resolve, reject) => {
      return db.query(searchDatas, (err, data) => {
        if (err) throw err;
        resolve(data)
      })
    })
  } else { // 否则取everyday_data中取某天的数值
    let searchDatas = `
      select city , city_x as x, city_y as y , aqi from everyday_data
      inner join city on city.city_name = everyday_data.city 
      where date= '${ctx.params.date}'
    `
    datas = await new Promise((resolve, reject) => {
      return db.query(searchDatas, (err, data) => {
        if (err) throw err;
        resolve(data)
      })
    })
  }
  if (datas.length) {
    ctx.body = {
      status: true,
      datas: datas
    }
  } else {
    ctx.body = {
      status: false,
      msg: "暂时无该日数据。"
    }
  }
})

// 散点图
home.get('/getScatterChart/:city', async (ctx) => {
  let sql = `
  select date, ct, city, so2, o3, co, no2, pm25, pm10, aqi
  from city_data where city = '${ctx.params.city}' and date_sub(curdate(),interval 3 DAY) <= date`
  let thisCityArr = await new Promise((resolve, reject) => {
    return db.query(sql, async (err, data) => {
      if (err) throw err
      resolve(data)
    })
  })
  if (thisCityArr.length) {
    ctx.body = {
      status: true,
      thisCityArr: thisCityArr
    }
  } else {
    ctx.body = {
      status: false,
      msg: "输入数据有误或暂时没有该项数据。"
    }
  }
})

// 柱状图
home.get('/getBarChart', async (ctx) => {
  let sql1 = `
  select date, city, floor(avg(aqi)) as aqi
  from city_data where city = '${ctx.query.city1}' and date_sub(curdate(),interval 3 DAY) <= date group by date
  `
  let city1 = await new Promise((resolve, reject) => {
    return db.query(sql1, async (err, data) => {
      if (err) throw err
      resolve(data)
    })
  })
  let sql2 = `
  select date, city, floor(avg(aqi)) as aqi
  from city_data where city = '${ctx.query.city2}' and date_sub(curdate(),interval 3 DAY) <= date group by date
  `
  let city2 = await new Promise((resolve, reject) => {
    return db.query(sql2, async (err, data) => {
      if (err) throw err
      resolve(data)
    })
  })
  let result;
  city1.length == 0 && city2.length == 0 ? result = [] : result = [city1, city2]
  if (result.length) {
    ctx.body = {
      status: true,
      twoCities: result
    }
  } else {
    ctx.body = {
      status: false,
      msg: "输入数据有误或暂时没有该项数据。"
    }
  }
})

// 获取地图城市数量
home.get('/getCityAmount', async (ctx) => {
  let searchCityAmount = `
  select count(city_name) as cityAmount from city
  `
  let cityAmount = await new Promise((resolve, reject) => {
    return db.query(searchCityAmount, async (err, data) => {
      if (err) throw err;
      resolve(data)
    })
  })
  if (cityAmount) {
    ctx.body = {
      status: true,
      cityAmount: cityAmount[0].cityAmount,
    }
  } else {
    ctx.body = {
      status: false,
      msg: "获取数据失败。"
    }
  }
})


// 折线图--查找某市今日数据
home.get('/getRealTimeCity/:city', async (ctx) => {
  let dt = new Date()
  let year = dt.getFullYear()
  let month = dt.getMonth() + 1
  let date = dt.getDate()
  month < 10 ? month = '0' + month : month
  date < 10 ? date = '0' + date : date
  let dateStr = `${year}-${month}-${date}`
  let sql = `select * from city_data where city = '${ctx.params.city}' and date = '${dateStr}'`
  let cityArr = await new Promise((resolve, reject) => {
    return db.query(sql, async (err, data) => {
      if (err) throw err
      resolve(data)
    })
  })
  if (cityArr.length) {
    ctx.body = {
      status: true,
      cityArr: cityArr
    }
  } else {
    ctx.body = {
      status: false,
      msg: "输入数据有误或暂时没有该项数据。"
    }
  }
})

// 排行榜
home.get('/getTop', async (ctx) => {
  let d = new Date()
  let year = d.getFullYear()
  let month = d.getMonth() + 1
  let dates = d.getDate()
  month = month < 10 ? '0' + month : month
  dates = dates < 10 ? '0' + dates : dates
  let dateStr = year + '-' + month + '-' + dates
  let hours = d.getHours()
  let hoursAndMins
  hours < 10 ? hoursAndMins = '0' + hours + ':10' : hoursAndMins = hours + ':10'
  let searchCurrent = `
    select * from city_data where date='${dateStr}' and ct='${hoursAndMins}'
  `
  let data = await new Promise((resolve, reject) => {
    return db.query(searchCurrent, async (err, data) => {
      if (err) throw err;
      resolve(data);
    })
  })
  if (data.length) {
    ctx.body = {
      status: true,
      data: data
    }
  } else {
    ctx.body = {
      status: false,
      msg: "暂时没有数据。"
    }
  }
})

// 获取空气质量指数标准
home.get('/getStandard', async (ctx) => {
  let searchStandard = `
  select limits, grade, influence, suggest from suggest
  `
  let standardData = await new Promise((resolve, reject) => {
    return db.query(searchStandard, async (err, data) => {
      if (err) throw err;
      resolve(data);
    })
  })
  if (standardData.length) {
    ctx.body = {
      status: true,
      standardData: standardData
    }
  } else {
    ctx.body = {
      status: false,
      msg: "暂时没有数据。"
    }
  }
})

module.exports = home