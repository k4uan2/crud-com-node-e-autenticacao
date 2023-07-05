const express = require("express");
const router = express.Router();
const Category = require("../categories/Category")

router.get("/articles", (req, res) => {
  res.send("<h1> Artigos </h1>")
})

router.get("/admin/article/new", (req, res) => {
  Category.findAll().then(categories => {
    res.render("admin/articles/new", {categories: categories})
  })
})

module.exports = router;