const db = require('./db')


async function insert() {
  let sql = `
  insert into city_data(date,ct,city,num,so2,o3,co,no2,pm25,pm10,aqi,quality)
  values ('2021-05-27', '18:10', '北京', 1, 1, 1, 1, 1, 1, 1, 1, '良好'),
  ('2021-05-27', '20:10', '北京', 1, 1, 1, 1, 1, 1, 1, 1, '良好')
  
 `
  let cityData = await new Promise((resolve, reject) => {
    return db.query(sql, async (err, data) => {
      if (err) throw err
      resolve(data.affectedRows)
    })
  })
  console.log(cityData);
}

insert() 