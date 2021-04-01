const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/usersDB', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

app.use(express.static("public"));
app.set("viewengine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('User', userSchema);

app.get("/", function(req, res){
    res.render("home.ejs");
});

app.get("/login", function(req, res){
    res.render("login.ejs");
});

app.get("/register", function(req, res){
    res.render("register.ejs");
});


app.get("/secrets", function(req, res){
    res.render("secrets.ejs");
})

app.post("/login", function(req, res){
    let username = req.body.username;
    let password = req.body.password;

    res.redirect("/secrets");
});

app.post("/register", function(req, res){
    let username = req.body.username;
    let password = req.body.password;

    const user = new User({
        username: username,
        password: password
    });

    user.save();

    res.redirect("/secrets");
});







app.listen(3000, function(){
    console.log("Server started at port 3000!");
});