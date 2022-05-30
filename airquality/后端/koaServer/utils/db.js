const mysql = require('mysql')

// 连接池
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  database: 'airquality',
  user: 'root',
  password: 'root'
})

function query(sql, callback) {
  pool.getConnection(function(err,connection) {
    connection.query(sql, function(err, rows) {
      callback(err, rows)
      connection.release() // 中断连接(一直开着栈用cpu)
    })
  })
}

exports.query = query;