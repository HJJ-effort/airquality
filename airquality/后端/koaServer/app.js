const Koa = require('koa2'); // 入口文件 // 大写k说明 Koa是个构造函数
const app = new Koa(); // 声明一个实例
const cors = require('koa2-cors'); // 导入允许后端跨域访问的模块
const port = 8888;

const router = require('./router/index');
const time = require('./utils/time')

/* 
  use()就是调用router中间件
  router.routes(): 启动路由
  router.allowedMethods(): 允许任何请求(get,post,put,delete)

*/

app.use(cors()); // 允许后端跨域访问
app.use(router.routes(), router.allowedMethods())

time.scheduleCronstyle() // 每小时调用一次

app.listen(8888, () => {
  console.log(`Server is running at http://localhost:${port}`);
})