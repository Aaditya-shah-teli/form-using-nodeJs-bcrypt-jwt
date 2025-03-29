
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const path = require("path");
const userModel = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

app.set('view engine', 'ejs');
app.set(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

const JWT_SECTET = "KAUASDUIM";


app.get('/', (req, res) => {
    res.render("index");
})
app.post('/create', async (req, res) => {
    const { name, number, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let createdUser = await userModel.create({
            name,
            email,
            number,
            password:hashedPassword
        });
        let token = jwt.sign({email}, JWT_SECTET);
        res.cookie("token", token)
    res.redirect('/');

    }
    catch(err){
        console.error(err);
        res.status(500).send("Error creating user");
    }


})



app.listen(3000, console.log("running on port 3000"));





