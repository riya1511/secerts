require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const bcrypt = require("bcrypt");
const saltRound = 10;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req,res) => {
    res.render("home");
})

app.get("/login", (req,res) => {
    res.render("login", {username: "", password: "", errorMsg: ""});
})

app.get("/register", (req,res) => {

    res.render("register");

});

app.post("/register", (req,res) => {

    bcrypt.hash(req.body.password, saltRound, function(err, hash) {
        const newUser = new User({
            username: req.body.username,
            password: hash
        });

        newUser.save((err) => {
            if(err){
                console.log(err);
            }else{
                res.render("secrets");
            }
        });

    });

});

app.post("/login", (req,res) => {

    const username = req.body.username;
    const password = req.body.password;

    User.findOne(
        {email: username},
        (error, foundUser) => {
            if(error){
                console.log(error);
            }else{
                if(foundUser){
                    bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
                        if(result === true){
                            res.render("secrets");
                        }
                    });
                //     else{
                //         res.render("login", {username: username, password: password, errorMsg: "Email or Password is incorrect"});
                //     }
                // }else{
                //     res.render("login", {username: username, password: password, errorMsg: "Email or Password is incorrect"});
                }
            }
        }
    );

});

app.listen(3000, () => console.log("App listening on port 3000"))