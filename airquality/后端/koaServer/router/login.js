const Router = require('koa-router');
const login = new Router();
const bodyparser = require('koa-bodyparser');
const db = require('../utils/db');
const jwt = require('jsonwebtoken'); // token生成模块

login.use(bodyparser()); // 调用这个中间件可以拿到前端post的数据

// 登录
login.post('/login', async (ctx) => {
  // console.log(ctx.request.body);
  let {username, password} = ctx.request.body;
  let searchUser = `select * from users where username = '${username}'`
  let dbUser = await new Promise((resolve, reject) => {
    return db.query(searchUser, (err, data) => {
      if (err) throw err;
      resolve(data); // data为一个数组 数组若为空则查不到
    })
  })
    
  if (dbUser.length > 0) { // 账号存在 进行密码验证
    if(dbUser[0].password == password) {
      ctx.body = {
        status: true,
        username: dbUser[0].username,
        token: dbUser[0].token,
        msg: "登录成功。"
      }
    } else { //密码错误
      ctx.body = {
        status: false,
        msg: "您输入的帐号或密码不正确，请重新输入。"
      }
    }
  } else { // 返回错误信息
    ctx.body = {
      status: false,
      msg: "您输入的帐号或密码不正确，请重新输入。"
    }
  }
})


// 注册用户
login.post('/register', async (ctx) => {
  // console.log(ctx.request.body);
  let {username, password} = ctx.request.body;
  let searchUser = `select * from users where username = '${username}'`
  
  let dbUser = await new Promise((resolve, reject) => {
    return db.query(searchUser, (err, data) => {
      if (err) throw err;
      resolve(data); 
    })
  })
  if (dbUser.length > 0) { // 账号已存在
    ctx.body = {
      status: false,
      msg: "帐号已被注册，请重新输入。"
    }
  } else { // 进行注册 添加用户
    // 创建token
    let token = jwt.sign({username: username, password: password}, 'secret', {expiresIn: 31536000}) // expiresIn是token的失效
    // 插入记录
    let insertUser = `insert into users(username, password, token) values ('${username}', '${password}', '${token}')`;
    let result = await new Promise((resolve, reject) => {
      return db.query(insertUser, (err, data) => {
        if(err) throw err;
        let obj = {
          status: true,
          msg: "注册成功。"
        }
        resolve(obj)
      })
    })
    ctx.body = result;
  }
})

module.exports = login