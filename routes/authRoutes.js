const {Router} = require ('express')
const router = Router()
const controller = require('../controllers/authController')
const cookieParser = require('cookie-parser')


router.use(cookieParser())
router.post('/login', controller.login)
router.get('/logout', controller.logout)
router.get('/refreshToken',controller.validateCookie, controller.refreshToken)
router.get('/protected',controller.verifyToken,controller.protected)

module.exports= router