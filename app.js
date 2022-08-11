require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')

//middleware
app.use(cors({
    credentials : true,
    origin : ['http://localhost:8080']
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

//auth routes
app.use('/auth', require('./routes/authRoutes'))

//run the server
app.listen(3000, () => console.log('listening on port 3000'))