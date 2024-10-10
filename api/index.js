const User = require('./models/User');
const express = require('express');
const cors = require('cors'); //used to enable cross-origin resource sharing
const app = express(); // create an instance of express application
const bcrypt = require('bcryptjs'); // used to hash passwords
const mongoose = require('mongoose'); // used to connect to MongoDB
const jwt = require('jsonwebtoken'); // used to sign and verify tokens
const cookieParser = require('cookie-parser'); // used to parse cookies
const multer = require('multer'); // used to upload files
const uploadMiddleware = multer({dest: 'uploads/'}); // set the destination folder for uploaded files
const fs = require('fs'); // used to work with the file system
const Post = require('./models/Post'); // import the Post model

// salt is used to hash the password
const salt = bcrypt.genSaltSync(10); 
const secret = "xdn4398r74639ncrf4328xm2mdshad"

// enable cross-origin resource sharing
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

// connect to MongoDB
mongoose.connect('mongodb+srv://mobashhirkhan:Mongodb.1!@cluster0.tclxicw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

// handling requests to /register endpoint
app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    // create a new user with provided username and password
    try{
        const userDoc = await User.create({
            username, 
            password: bcrypt.hashSync(password, salt)
        });
        res.json(userDoc);
    } catch(e) { // if there is an error, send the error as response
        res.status(400).json(e);
    }
});

// handling requests to /login endpoint
app.post('/login', async (req,res) => {
    const {username, password} = req.body; // extract username and password from request body
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password); 
    if (passOk) {
        //logged in
        jwt.sign({username, id:userDoc._id}, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            });
        });
    } else {
        res.status(400).json('wrong credentials');
    }
});

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });
    res.json(req.cookies)
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const {originalname, path} = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {title, summary, content} = req.body;
        const postDoc = await Post.create({
        title, 
        summary, 
        content,
        cover: newPath,
        author: info.id
    });
    res.json(postDoc);

    });

});

app.get('/post', async (req, res) => {
    // const posts = await Post.find();
    res.json(await Post.find());
});

app.listen(4000); // start the server on port 4000