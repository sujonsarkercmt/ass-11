
//========================================================================================
//                                Import File
//========================================================================================
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const path = require('path')
let jwt = require('jsonwebtoken')


const bcrypt = require('bcrypt');
const saltRounds = 10;
global.bcrypt = bcrypt;
global.saltRounds = saltRounds;


app.set('trust proxy', true);


const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");


const cors = require('cors');
const corsOrigins = JSON.parse(process.env.corsOrigins);
app.use(cors({ origin: corsOrigins, credentials: true }));



const cookieParser = require('cookie-parser');
app.use(cookieParser());

const io = new Server(server, {
    cors: {
        origin: corsOrigins, // Allow requests from this origin
        methods: ['GET', 'POST', 'PATCH'], // Allowed HTTP methods
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    },
});




//========================================================================================
//                                Express File
//========================================================================================
app.use('/static', express.static('public'));
app.use('/images', express.static('images'));
app.use(express.urlencoded({
    limit: '150mb',
    extended: true
}));



mongoose.set('strictQuery', true);
let url = `mongodb+srv://sujon:rtfm4523@cluster0.46qj8uo.mongodb.net/xyz?retryWrites=true&w=majority`
mongoose
    .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log('MongoDB database connection successfully');
});

//========================================================================================
//                                 Data base schema
//========================================================================================

const profile = require('./database/admin');
profile.connectToDatabase();

const loginRoute = require('./database/loginRoute');
loginRoute.connectToDatabase();

const service = require('./database/service');
service.connectToDatabase();


let login = mongoose.model('login');
//========================================================================================
//                                 Route
//========================================================================================


const logind = require('./routes/login/login.js');
app.use('/login', logind);

const serviced = require('./routes/service/service.js');
app.use('/service', serviced);





//-------------------------Require File 
const passport = require('passport')
const google = require('passport-google-oauth20');
var session = require('express-session');
const cookie = require('cookie-parser')



//------------------------Make Session And Serialize 
const oneDay = 1000 * 1000;//milisecound
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: ({ maxAge: oneDay })
}));

app.use(passport.authenticate('session'));
passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username, name: user.name });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});


//----------------------New Strategy
passport.use(new google({
    clientID: '502038386925-fqhmes56kb48gscf4ud5ngdug9q960h1.apps.googleusercontent.com', //----------->> 
    clientSecret: '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', //----------->> 
    callbackURL: '/googleCallBack', // Replace with your actual URL

}, (accessToken, refreshToken, profile, done) => {
    console.log(accessToken)
    done(null, { profile })
}))



//----------------Handle Request

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', "email"]
}));

app.get('/googleCallBack', passport.authenticate('google', { failureRedirect: '/fail' }),
    async (req, res) => {
 
        console.log(req.user)
        try {
            let userExist = await login.findOne({ email: req.user.profile._json.email })
            console.log(userExist)
            if (!userExist) { 
                let newRegisterid = new login(
                    {
                        username: req.user.profile.displayName,
                        password: req.user.profile.id,
                        email: req.user.profile._json.email,
                        imageURL: req.user.profile._json.picture,
                    }
                )
                await newRegisterid.save()
                console.log(newRegisterid)
 
                let tokenforCookei = {
                    password: newRegisterid.password,
                    email: newRegisterid.email,
                }

                //vreify token
                let token = jwt.sign(tokenforCookei, process.env.jwt_key, { expiresIn: '24h' });

                res.cookie('token', token, {
                    maxAge: 24 * 60 * 60 * 1000,
                });

                res.sendFile(path.join(__dirname, 'dist', 'index.html'));
            }

            else {
                let userExist = await login.findOne({ email: req.user.profile._json.email, password: req.user.profile.id }) 
                if (userExist) {
                    let tokenforCookei = {
                        password: userExist.password,
                        email: userExist.email,
                    }
                    //vreify token
                    let token = jwt.sign(tokenforCookei, process.env.jwt_key, { expiresIn: '24h' });

                    res.cookie('token', token, {
                        maxAge: 24 * 60 * 60 * 1000,
                    });
                    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
                } else {
                    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
                }
            }
        } catch (error) {
            res.status(500).json({ data: 'registerErrorTryAgainLater' })
        }
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    })

 


app.get('/fail', (req, res) => {
    res.send('Log Err')
})





//========================================================================================
//                                Request and Responsse
//========================================================================================
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});





//========================================================================================
//                                Server Start
//========================================================================================
server.listen(80, () => {
    console.log(`Server is running on port`, 80);
});

