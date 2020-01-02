const mysql = require('mysql')

module.exports = (sql,params=[]) => {
  //创建
  const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: "root",
    password: "root",
    database: '1707d-userlist'
  })

  //连接
  connection.connect((error) => {
    if (error) {
      //连接失败返回no
      console.log("no")
    } else {
      //连接成功返回yes
      console.log("yes")
    }
  })

  //增删改操作
  return new Promise((resolve, reject) => {
    connection.query(sql,params,(error, data) => {
      if (error) {
          //返回错误信息
          reject(error)
      } else {
          //返回成功信息
          resolve(data) 
      }
      //关闭
      connection.end();
    })
  })

}