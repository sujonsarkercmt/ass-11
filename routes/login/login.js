const express = require('express')
const routes = express.Router();
const multer = require('multer');
let upload = multer({}).none()
let jwt = require('jsonwebtoken')
// let loginCheck = require('../Login/loginCheck')


//--------------Logincheck---------------------------
routes
    .route('/logincheck')
    .get(async (req, res) => {
        upload(req, res, async function (err) {
            try {
                jwt.verify(req.cookies.token, process.env.jwt_key, async (err, data) => {
                    if (err) {
                        console.log(err)
                        res.status(200).json({ data: 'tokenExpired' })
                    } else {
                        let userExist = await login.findOne({
                            email: data.email,
                        })
                        console.log(data)

                        if (userExist) {
                            res.status(200).json({ data: 'success' })
                        } else {
                            res.status(200).json({ data: 'usernotfound' })
                        }
                    }
                })
  
            } catch (error) {
                console.log(error)
                res.status(500).json({ data: 'serverError' })
            }
        })
    });


//--------------register---------------------------
routes
    .route('/register')
    .post(async (req, res) => {
        upload(req, res, async function (err) {

            try {
                let userExist = await login.findOne({ email: req.body.email })
                if (!userExist) {
                    let newRegisterid = new login(req.body)
                    await newRegisterid.save()

                    let tokenforCookei = {
                        password: newRegisterid.password,
                        email: newRegisterid.email,
                    }

                    //vreify token
                    let token = jwt.sign(tokenforCookei, process.env.jwt_key, { expiresIn: '24h' });

                    res.cookie('token', token, {
                        maxAge: 24 * 60 * 60 * 1000,
                    });

                    res.status(200).json({ data: 'success' })
                }

                else {
                    res.json({ data: 'registeredEmailNotAllow' })
                }
            } catch (error) {
                console.log(error)
                res.status(500).json({ data: 'registerErrorTryAgainLater' })
            }
        })
    });



//--------------Login---------------------------
routes
    .route('/login')
    .post(async (req, res) => {
        upload(req, res, async function (err) {

            try {
                let userExist = await login.findOne({ email: req.body.email, password: req.body.password })
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
                    res.status(200).json({ data: 'success' })
                }
                else {
                    res.json({ data: 'userNotFound' })
                }
            } catch (error) {
                console.log(error)
                res.status(500).json({ data: 'registerErrorTryAgainLater' })
            }
        })
    });
 


    //--------------------- logout ---------------------------
routes
.route('/logout')
.get(async (req, res) => {
    try {
        res.cookie('token', '', { expires: new Date(0) }); 
        res.status(200).json({ data: 'success' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ data: 'serverError' })
    }
});


module.exports = routes;