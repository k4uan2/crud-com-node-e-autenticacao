const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");
const articlesController = require("./articles/ArticlesController");
const categoriesController = require("./categories/CategoriesController");
const usersController = require("./users/usersController");
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const Users = require("./users/Users");
const { render } = require("ejs");

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


//Sessions
app.use(session({
  secret: "whatwhatwhatwhatwhat", cookie: { maxAge: 3000000}
}))

//view engine
app.set("view engine", "ejs")

//static
app.use(express.static("public"))

//ROUTERs
app.use("/", articlesController);
app.use("/", categoriesController);
app.use("/", usersController);

app.get("/:slug", (req, res) => {
  var slug = req.params.slug

  Article.findOne({
    where: {
      slug: slug
    }
  }).then(article => {
    if(article != undefined) {
      Category.findAll().then((categories) => {
        res.render("article", {article: article, categories: categories})
      })
    }
  })
})

app.get("/", (req, res) => {
  Article.findAll({
    order: [
      ['id', 'desc']
    ],
    limit: 4
  }).then((articles) => {
    Category.findAll().then((categories) => {
      res.render("index", {articles: articles, categories: categories})
    })

    
  })
})

app.get("/categories/:slug", (req, res) => {
  var slug = req.params.slug

  Category.findOne({
    where: {
      slug: slug
    },
    include: [{model: Article}]
  }).then((category) => {
    if(category != undefined){
      Category.findAll().then((categories) => {
        res.render("index", {articles: category.articles, categories: categories})
      })
    }else{
      res.redirect("/")
    }
  }).catch(err => {
    console.log(err)
    res.redirect("/")
  })
})

app.listen(3000, ()=> {
  console.log("servidor no ar!")
})