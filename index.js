const express = require("express");
const cookieParser = require("cookie-parser");
const csrf = require('csurf')

const app = express();
const port = process.env.PORT || 3000;
const csrfProtection = csrf({cookie: true});

app.set("view engine", "pug");
app.use(cookieParser());
app.use(express.urlencoded());


app.get("/", (req, res) => {
  res.render("index",{users});
});

app.get("/create", csrfProtection, (req,res)=>{
  res.render("normal-form",{csrfToken: req.csrfToken()});
})

const validation = (req,res,next)=>{
  const { firstName, lastName, email, password, confirmedPassword } = req.body;
  let errors = [];

  if(!firstName) {
    errors.push("Please provide a first name.");
  }

  if(!lastName) {
    errors.push("Please provide a last name.");
  }

  if(!email) {
    errors.push("Please provide an email.");
  }

  if (!password) {
    errors.push("Please provide a password.");
  }

  if(confirmedPassword !== password){
    errors.push("The provided values for the password and password confirmation fields did not match.")
  }

  if(errors.length) {
    res.render("normal-form", { errors, firstName, lastName, email, csrfToken: req.csrfToken()});
    return;
  }

  req.message = errors;
  next();
};

const validationInteresting = (req,res,next)=>{
  const { firstName, lastName, email, password, confirmedPassword, age, favoriteBeatle, iceCream } = req.body;
  let errors = [];

  if(!firstName) {
    errors.push("Please provide a first name.");
  }

  if(!lastName) {
    errors.push("Please provide a last name.");
  }

  if(!email) {
    errors.push("Please provide an email.");
  }

  if (!password) {
    errors.push("Please provide a password.");
  }

  if(confirmedPassword !== password){
    errors.push("The provided values for the password and password confirmation fields did not match.")
  }

  if(!age) {
    errors.push("age is required");
  }else if(age > 120 || age < 0 || isNaN(age)){
    errors.push("age must be a valid age")  }

  if(!favoriteBeatle) {
    errors.push("favoriteBeatle is required");
  }else if(!['John','Paul','Ringo','George'].includes(favoriteBeatle)){
    errors.push('favoriteBeatle must be a real Beatle member')
  }


  if(errors.length) {
    res.render("create-interesting", { errors, firstName, lastName, email, age, favoriteBeatle, iceCream,csrfToken: req.csrfToken()});
    return;
  }

  req.message = errors;
  next();
};

app.post("/create", csrfProtection, validation,(req,res) => {
  const { firstName, lastName, email, password, confirmedPassword } = req.body;

  users.push({
    id: users.length+1,
    firstName,
    lastName,
    email
  });

  res.redirect('/');
});




const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com"
  }
];

app.get("/create-interesting", csrfProtection, (req,res)=>{
  res.render("create-interesting",{csrfToken: req.csrfToken()});
})

app.post("/create-interesting", csrfProtection, validationInteresting,(req,res) => {
  const { firstName, lastName, email, password, confirmedPassword,age,favoriteBeatle,iceCream } = req.body;

  users.push({
    id: users.length+1,
    firstName,
    lastName,
    email,
    age,
    favoriteBeatle,
    iceCream
  });

  res.redirect('/');
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
