require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const con = require('../model/database')

module.exports = {
    /*  login (req, res) {
        // const {name} = req.body.
        const name = 'shaun'
        const email = 'shaun@gmail.com'
        const password = "shaun12"
        const hashedPass = '$2a$10$opQsWMI5Qf0LluMznYvmneOkfQLsmfdqss2QsjDePj48jWm6I07FC'
    
        bcrypt.compare(password, hashedPass, (err, result) => {
            if (err) throw err
        })
    
        const options = {
            exportsIn: '20m',
            httpOnly: true
        }
    
        const token = jwt.sign({name:name, email: email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1y',
            audience: email
        })
    
        res.cookie('jwt', token, options)
        res.sendStatus(200)
    },

    //middleware validateCookie
    refreshToken(req, res) {
        const respond = { info: req.info, refreshToken: req.refreshToken }

        res.send(respond)
    }, */
    login(req, res) {
        const { email, password } = req.body
        var name = ''
        var hashedPass = ''

        con.query('select name , password from users where email = ? ', [email], (err, result) => {
            if (err) throw err
            else if (result == '') res.send({msg:'invalid email',permission : false} )
            else {
                name = result[0].name
                hashedPass = result[0].password

                bcrypt.compare(password, hashedPass, (err, result) => {
                    if (err) return
                    else if (result == false) res.send({msg :'ivalid password',permission:false})
                    else if (result) {
                        const options = {
                            exportsIn: '20m',
                            httpOnly: true
                        }

                        const token = jwt.sign({ name: name, email: email }, process.env.ACCESS_TOKEN_SECRET, {
                            expiresIn: '1y',
                            audience: email
                        })

                        res.cookie('jwt', token, options)
                        res.status(200).send({msg:'you are logged in',permission:true})
                    }
                })
            }
        })
    },

    //middleware validateCookie
    refreshToken(req, res) {
        const respond = { info: req.info, refreshToken: req.refreshToken }
        res.send(respond)
    },

    //middleware verifyToken
    protected(req, res) {
        const msg = {
            data: 'you are authorized'
        }
        res.send(msg)
    },

    logout(req, res) {
        const options = {
            exportsIn: '1',
            httpOnly: true
        }
        res.cookie('jwt', '', options)
        res.send('you are logged out')
    },

    //function and middleware
    validateCookie(req, res, next) {
        const { cookies } = req
        //console.log(cookies.jwt)
        jwt.verify(cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {console.log('not authorized')
              next()}
            else {
                refreshToken = generateRefreshToken({ email: user.email })
                req.refreshToken = refreshToken
                req.info = { name: user.name, email: user.email }
                next()
            }
        })
    },
    verifyToken(req, res, next) {
        if (!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus('401')
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                return next(createError.Unauthorized(message))
            }
            next()
        })
    }
}

//functions inside
const generateRefreshToken = (info) => {
    return (jwt.sign(info, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '20m'
    }))
}

