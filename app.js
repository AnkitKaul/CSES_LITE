require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect('mongodb://localhost:27017/usersDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    handle: String, 
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);

//passport code.. copied from documentation
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/dashboard/:handle", function(req, res){
    if(req.isAuthenticated()){
        // let handle = req.body.handle;
        // console.log(req.params.handle);

        res.render("dashboard", {handle: req.params.handle});
    } else {
        res.redirect("/login");
    }
});

app.get("/logout", function(req, res){
    req.logout();

    res.redirect("/");
});


app.post("/login", function(req, res){
    User.findOne({username: req.body.username}, function(err, use){
        if (err) {
            console.log(err);
            res.redirect("/login");
        } else {
            const handle = use.handle;

            // console.log(handle);
            const user = new User({
                handle: handle,
                username: req.body.username,
                password: req.body.password
            });
            
            req.logIn(user, function(err){
                if (err) {
                    console.log(err);
                    res.redirect("/login");
                } else {
                    passport.authenticate("local")(req, res, function(){
                        // console.log("/dashboard/" + handle);
                        res.redirect("/dashboard/" + handle);
                    });
                }
            });
        }
    });
    
});

app.post("/register", function(req, res){
    let handle   = req.body.handle;
    let username = req.body.username;
    let password = req.body.password;

    User.register({handle: handle, username: username}, password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/dashboard/" + handle);
            });
        }
    });
});







app.listen(3000, function(){
    console.log("Server started at port 3000!");
});