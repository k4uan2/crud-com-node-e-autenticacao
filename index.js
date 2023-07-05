const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const connection = require("./database/database")
const articlesController = require("./articles/ArticlesController")
const categoriesController = require("./categories/CategoriesController")
const Article = require("./articles/Article")
const Category = require("./categories/Category")

//Connection
connection
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados realizada com sucesso!")
  }).catch((err)=>{
    console.log(err)
  })

//body-parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//view engine
app.set("view engine", "ejs")

//static
app.use(express.static("public"))

//ROUTERs
app.use("/", articlesController);
app.use("/", categoriesController);

app.get("/", (req, res) => {
  res.render("index")
})

app.listen(3000, ()=> {
  console.log("servidor no ar!")
})