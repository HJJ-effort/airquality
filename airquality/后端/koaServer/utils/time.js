const putIn = require('./putIn')
const schedule = require('node-schedule')
const db = require('../utils/db');

// 获取时间字符串 取当前小时拼接:10
function getHoursAndMins() {
  let dt = new Date()
  let hours = dt.getHours()
  let hoursAndMins
  hours < 10 ? hoursAndMins = '0' + hours + ':10' : hoursAndMins = hours + ':10'
  return hoursAndMins
}

// 新的一天需要做的   
async function newDayNeedDO() {
  // 拿到前一天的日期
  let yesterdayTime = (new Date).getTime() - 24 * 60 * 60 * 1000
  let yesterday = new Date(yesterdayTime)
  let yesterdayStr = yesterday.getFullYear() + "-" + (yesterday.getMonth() > 9 ? (yesterday.getMonth() + 1) : "0" + (
    yesterday.getMonth() + 1)) + "-" + (yesterday.getDate() > 9 ? (yesterday.getDate()) : "0" + (yesterday
    .getDate()))
  // 判断前一天的数据是否已经插入(为了解决0点重启服务器重复插入的问题)
  let yesterdayIsExistSql = `
    select count(date) as dateCount from everyday_data where date = '${yesterdayStr}'
  `
  let dateCount = await new Promise((resolve, reject) => {
    return db.query(yesterdayIsExistSql, async (err, data) => {
      if (err) throw err
      resolve(data)
    })
  })
  if (dateCount[0].dateCount == 0) {
    // 找出前一天的数据求平均
    let selectSql = `
      select date, city, round(avg(so2)) as so2, round(avg(o3)) as o3, round(avg(co), 1) as co,round(avg(no2)) as no2, round(avg(pm25)) as pm25, round(avg(pm10)) as pm10, round(avg(aqi)) as aqi from city_data
      where date= '${yesterdayStr}' GROUP BY city
    `
    let selectCityData = await new Promise((resolve, reject) => {
      return db.query(selectSql, async (err, data) => {
        if (err) throw err
        resolve(data)
      })
    })
    // 根据selectCityData的aqi来为每一项添加quality
    selectCityData.map(item => {
      if (item.aqi > 0 && item.aqi <= 50) {
        item.quality = '优质'
      } else if (item.aqi > 50 && item.aqi <= 100) {
        item.quality = '良好'
      } else if (item.aqi > 100 && item.aqi <= 150) {
        item.quality = '轻度污染'
      } else if (item.aqi > 150 && item.aqi <= 200) {
        item.quality = '中度污染'
      } else if (item.aqi > 200 && item.aqi <= 300) {
        item.quality = '重度污染'
      } else if (item.aqi > 300 && item.aqi <= 500) {
        item.quality = '严重污染'
      }
    })
    // 将前一天的平均数据插入到everyday_data表中
    selectCityData.map(async item => {
      let insertSql = `
        insert into everyday_data(date, city, so2, o3, co, no2, pm25, pm10, aqi, quality)
        values ('${item.date}', '${item.city}', ${item.so2}, ${item.o3}, ${item.co}, ${item.no2}, ${item.pm25}, ${item.pm10}, ${item.aqi}, '${item.quality}')
      `
      let insertCityData = await new Promise((resolve, reject) => {
        return db.query(insertSql, async (err, data) => {
          if (err) throw err
          resolve(data)
        })
      })
    })
    console.log('everyday_data表中' + yesterdayStr + '日添加成功');
  } else {
    console.log('everyday_data表中' + yesterdayStr + '数据已存在' + dateCount[0].dateCount + '条，无法重复添加');
  }

  // 查找日期的数量
  let dayNumSql = `
  select distinct date from city_data
  `
  let dayNumData = await new Promise((resolve, reject) => {
    return db.query(dayNumSql, async (err, data) => {
      if (err) throw err
      resolve(data)
    })
  })
  console.log('city_data中有' + dayNumData.length + '天的数据');
  // 保存3天的数据 就要删除掉三天前的数据  
  if (dayNumData.length > 3) {
    let twoDayTime = (new Date).getTime() - 3 * (24 * 60 * 60 * 1000)
    let twoDayBefore = new Date(twoDayTime)
    let twoDayBeforeStr = twoDayBefore.getFullYear() + "-" + (twoDayBefore.getMonth() > 9 ? (twoDayBefore.getMonth() + 1) : "0" + (
      twoDayBefore.getMonth() + 1)) + "-" + (twoDayBefore.getDate() > 9 ? (twoDayBefore.getDate()) : "0" + (twoDayBefore
      .getDate()))
    let deleteSql = `
    delete from city_data where date='${twoDayBeforeStr}'
    `
    await new Promise((resolve, reject) => {
      return db.query(deleteSql, async (err, data) => {
        if (err) throw err
        resolve(data)
      })
    })
    console.log('删除了' + twoDayBeforeStr + '日的数据')
  }
}


// 服务器启动直接执行一次
async function everyHourDo() {
  let hoursAndMins = getHoursAndMins()
  await putIn.getRealTimeData(hoursAndMins)
  
  let hours = new Date().getHours()
  if (hours == 0) { // 已经是新的一天
  await newDayNeedDO()
  }
}

everyHourDo()

const scheduleCronstyle = () => {
  //每分钟的小时11分0秒定时执行一次:
  schedule.scheduleJob('0 11 * * * *', async () => {
    everyHourDo()
  });
}

exports.scheduleCronstyle = scheduleCronstyle;