const db = require('./db')
const axios = require('axios')

async function getRealTimeData(hoursAndMins) {
  let d = new Date()
  let year = d.getFullYear()
  let month = d.getMonth() + 1
  let dates = d.getDate()
  month = month < 10 ? '0' + month : month
  dates = dates < 10 ? '0' + dates : dates
  let dateStr = year + '-' + month + '-' + dates
  // 判断当前小时的数据是否已经插入  防止重复添加
  let thisHourIsExistSql = `
    select count(ct) as ctCount from city_data where date = '${dateStr}' and ct = '${hoursAndMins}'
  `
  let ctCount = await new Promise((resolve, reject) => {
    return db.query(thisHourIsExistSql, async (err, data) => {
      if (err) throw err
      resolve(data)
    })
  })
   // 限定必须不能重复插入
    if (ctCount[0].ctCount == 0) {
    let amount = 0
    let response = await new Promise((resolve, reject) => {
        resolve(axios.get('https://api.apishop.net/common/air/getPM25Top?apiKey=kn5FwrFc4483eb4974c3b02a5d12ffc18893cf972370c57'))
      })
      .catch(error => {
        console.log(error)
      })
    let list = response.data.result.list
    for (let i = 0; i < list.length; i++) {
      let {
        ct,
        area,
        num,
        so2,
        o3,
        co,
        no2,
        pm2_5,
        pm10,
        aqi,
        quality
      } = list[i]
      if(!parseFloat(pm10)) {
        pm10 = null
      }
      let sql = `
            insert into city_data(date,ct,city,num,so2,o3,co,no2,pm25,pm10,aqi,quality)
            values ('${ct.slice(0, 10)}', '${hoursAndMins}', '${area}', ${Number(num)}, ${Number(so2)}, ${parseFloat(o3)}, ${Number(co)}, ${Number(no2)}, ${pm2_5}, ${Number(pm10)}, ${Number(aqi)}, '${quality}')
          `
      let one = await new Promise((resolve, reject) => {
        return db.query(sql, async (err, data) => {
          if (err) throw err
          resolve(data.affectedRows)
        })
      })
      amount += one
    }
    console.log('city_data表' + dateStr + '-' + hoursAndMins + '的' + amount + '条数据添加成功');
  } else {
    console.log('city_data表中' + dateStr + '-' + hoursAndMins + '数据已有' + ctCount[0].ctCount + '条，无法重复添加');
  }
}

exports.getRealTimeData = getRealTimeData;