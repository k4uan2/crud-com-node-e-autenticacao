const express = require("express");
const router = express.Router();
const Users = require("./Users");
const bcrypt = require("bcryptjs")

router.get("/admin/users", (req, res) => {
  Users.findAll().then(users => {
    res.render("admin/users/index", {users: users})
  }).catch(() => {
    res.redirect("/")
  })
  
  
})

router.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create")
})

router.post("/users/save", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  Users.findOne({
    where: {
      email: email
    }
  }).then(user => {
    if(user == undefined){
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);

      Users.create({
      email: email,
      password: hash
      }).then(()=> {
        res.redirect("/")
      }).catch(err => {
        console.log(err)
        res.redirect("/")
      })
     }else{
      res.redirect("/admin/users/create")
    }
  })
  

})

router.get("/login", (req, res) => {
  res.render("admin/users/login")
})

router.post("/authenticate", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  
  Users.findOne({where: {email: email}}).then(user => {
    if(user != undefined){

      let validation = bcrypt.compareSync(password, user.password)

      if(validation){
        req.session.user = {
          id: user.id,
          email: user.email
        }
      }else{
        res.redirect("/login")
      }

    }else{
      res.redirect("/login")
    }
    res.redirect("/admin/categories")

  })

})


router.get("/logout", (req, res) => {
  req.session.user = undefined
  res.redirect("/")
})

module.exports = router