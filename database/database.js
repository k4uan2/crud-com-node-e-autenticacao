const Sequelize = require("sequelize")

const connection = new Sequelize("proj_blog", "root", "wtfdracarys", {
  host: "localhost",
  dialect: "mysql"
})

module.exports = connection