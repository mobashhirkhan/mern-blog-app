const User = require('./models/User');
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://mobashhirkhan:Mongodb.1!@cluster0.tclxicw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.create({username, password});
    res.json(userDoc);
});

app.listen(4000);


// mongodb+srv://mobashhirkhan:Mongodb.1!@cluster0.tclxicw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
