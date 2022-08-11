require('dotenv').config()
const mysql = require('mysql')


const con = mysql.createConnection({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name
  });

con.connect((err) => {
    if(err) console.log(err)
    console.log('DB connected!')
})

module.exports = con