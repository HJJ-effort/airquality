// router的入口文件
const Router = require('koa-router')
const router = new Router();
const login = require('./login')
const home = require('./home')

// 重定向
// router.redirect('/', '/login');

router.use('/login', login.routes(), login.allowedMethods())
router.use('/home', home.routes(), home.allowedMethods())


module.exports = router
