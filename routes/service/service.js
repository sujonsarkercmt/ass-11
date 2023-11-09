const express = require('express')
const routes = express.Router();
const multer = require('multer');
let upload = multer({}).none()
let jwt = require('jsonwebtoken')



const crypto = require('crypto');

function generateRandomNumberString(length) {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, characters.length);
        randomString += characters[randomIndex];
    }

    return randomString;
}




//--------------add service---------------------------
routes
    .route('/addService')
    .post(async (req, res) => {
        upload(req, res, async function (err) {

            try {
                jwt.verify(req.cookies.token, process.env.jwt_key, async (err, data) => {
                    if (err) {
                        res.status(200).json({ data: 'tokenExpired' })
                    } else {
                        let userExist = await login.findOne({ email: data.email, password: data.password })

                        if (userExist) {

                            try {
                                let AddNewServic = new Service(req.body)
                                AddNewServic.user = userExist._id
                                await AddNewServic.save()

                                userExist.Services.unshift(AddNewServic)
                                await userExist.save()

                                res.json({ data: 'success', AddNewServic })
                            } catch (error) {
                                console.log(error)
                                res.status(500).json({ data: 'serverError' })
                            }

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






//--------------servicesRetrive---------------------------
routes
    .route('/servicesRetrive')
    .get(async (req, res) => {
        upload(req, res, async function (err) {
            try {
                jwt.verify(req.cookies.token, process.env.jwt_key, async (err, data) => {
                    if (err) {
                        res.status(200).json({ data: 'tokenExpired' })
                    } else {
                        let userExist = await login.findOne({ email: data.email, password: data.password })
                        if (userExist) {
                            await userExist.populate('Services')
                            res.json({ data: 'success', user: userExist })
                        } else {
                            res.json({ data: 'userNotFound' })
                        }
                    }
                })
            } catch (error) {
                console.log(error)
                res.status(500).json({ data: 'serverError' })
            }
        })
    });

//--------------servicesRetrive all---------------------------
routes
    .route('/servicesRetriveAll')
    .get(async (req, res) => {
        upload(req, res, async function (err) {
            try {

                let allservices = await Service
                    .find({})
                    .sort({ createdAt: -1 })
                    .populate({
                        path: 'user',
                        select: 'username imageURL' // Replace with the fields you want to populate
                    })
                    .exec();

                res.json({ data: 'success', service: allservices })


            } catch (error) {
                console.log(error)
                res.status(500).json({ data: 'serverError' })
            }
        })
    });



//--------------delete service ---------------------------
routes
    .route('/deleteService')
    .post(async (req, res) => {
        upload(req, res, async function (err) {
            try {
                jwt.verify(req.cookies.token, process.env.jwt_key, async (err, data) => {
                    if (err) {
                        res.status(200).json({ data: 'tokenExpired' })
                    } else {
                        let userExist = await login.findOne({ email: data.email, password: data.password })
                        if (userExist) {
                            await userExist.populate('Services')
                            userExist.Services.map(item => {
                                if (item._id.toString() === req.body.serviceID) {
                                    item.remove()
                                }
                            })
                            await userExist.save()
                            res.json({ data: 'success' })
                        } else {
                            res.json({ data: 'userNotFound' })
                        }
                    }
                })
            } catch (error) {
                console.log(error)
                res.status(500).json({ data: 'serverError' })
            }
        })
    });



//--------------delete service ---------------------------
routes
    .route('/updateService')
    .post(async (req, res) => {
        upload(req, res, async function (err) {
            try {
                jwt.verify(req.cookies.token, process.env.jwt_key, async (err, data) => {
                    if (err) {
                        res.status(200).json({ data: 'tokenExpired' })
                    } else {
                        let userExist = await login.findOne({ email: data.email, password: data.password })
                        if (userExist) {
                            try {
                                let serviceData = JSON.parse(req.body.service)
                                const isServiceIncluded = userExist.Services.findIndex(item => item._id.toString() === serviceData._id);
                                console.log(isServiceIncluded, serviceData)
                                if (isServiceIncluded != -1) {
                                    let updateddata = await Service.findByIdAndUpdate(serviceData._id, serviceData, { new: true })
                                    res.json({ data: 'success', updateddata })
                                } else {
                                    res.json({ data: 'unauthorized request' })
                                }
                            } catch (error) {
                                console.log(error)
                                res.json({ data: 'serverError' })
                            }
                        } else {
                            res.json({ data: 'userNotFound' })
                        }
                    }
                })
            } catch (error) {
                console.log(error)
                res.status(500).json({ data: 'serverError' })
            }
        })
    });





//--------------bookService data ---------------------------
routes
    .route('/bookService')
    .post(async (req, res) => {
        upload(req, res, async function (err) {
            try {
                jwt.verify(req.cookies.token, process.env.jwt_key, async (err, data) => {
                    if (err) {
                        res.status(200).json({ data: 'tokenExpired' })
                    } else {
                        let userExist = await login.findOne({ email: data.email, password: data.password })
                        if (userExist) {
                            let servicedata = await Service
                                .findById(req.body.service)
                                .populate({
                                    path: 'user',
                                    select: 'imageURL username email',
                                })
                            if (servicedata) {
                                res.json({ data: 'success', service: servicedata })
                            } else {
                                res.json({ data: 'serviceNotFound' })
                            }

                        } else {
                            res.json({ data: 'userNotFound' })
                        }
                    }
                })
            } catch (error) {
                console.log(error)
                res.status(500).json({ data: 'serverError' })
            }
        })
    });




//--------------booking a Service ---------------------------
routes
    .route('/bookServiceRequest')
    .post(async (req, res) => {
        upload(req, res, async function (err) {
            try {
                jwt.verify(req.cookies.token, process.env.jwt_key, async (err, data) => {
                    if (err) {
                        res.status(200).json({ data: 'tokenExpired' })
                    } else {
                        let userExist = await login.findOne({ email: data.email, password: data.password })
                        if (userExist) {

                            let servicedata = await Service
                                .findById(req.body.ServiceID)
                                .populate({
                                    path: 'user',
                                    select: 'imageURL username email',
                                })
                            
                            console.log(userExist._id , servicedata.user._id)
                            if (userExist._id.toString() === servicedata.user._id.toString()) {
                                res.json({data:'youcannotbookownservice'})
                                return
                            }


                            if (servicedata) {
                                let BookService = {
                                    date: req.body.bookDate,
                                    area: req.body.BookArea,
                                    serviceState: 'Pending',

                                    OriginalService: servicedata._id,
                                    serviceBookedby: userExist._id,
                                    serviceProvideBy: servicedata.user._id,
                                    trackID: generateRandomNumberString(30),
                                }

                                let serviceProviderProfile = await login.findById(servicedata.user._id)

                                serviceProviderProfile.myWork.unshift(BookService)
                                userExist.myBookService.unshift(BookService)

                                await serviceProviderProfile.save()
                                await userExist.save()

                                res.json({ data: 'success', service: userExist.myBookService })

                            } else {
                                res.json({ data: 'serviceNotFound' })
                            }
                        } else {
                            res.json({ data: 'userNotFound' })
                        }
                    }
                })
            } catch (error) {
                console.log(error)
                res.status(500).json({ data: 'serverError' })
            }
        })
    });




//--------------My schedules ---------------------------
routes
    .route('/mySchedules')
    .get(async (req, res) => {
        upload(req, res, async function (err) {
            try {
                jwt.verify(req.cookies.token, process.env.jwt_key, async (err, data) => {
                    if (err) {
                        res.status(200).json({ data: 'tokenExpired' })
                    } else {
                        let userExist = await login
                            .findOne({ email: data.email, password: data.password })
                            .populate({
                                path: 'myBookService.OriginalService',
                                options: { strictPopulate: false },
                            })
                            .populate({
                                path: 'myBookService.serviceBookedby',
                                options: { strictPopulate: false },
                                select: 'email imageURL username'
                            })
                            .populate({
                                path: 'myBookService.serviceProvideBy',
                                options: { strictPopulate: false },
                                select: 'email imageURL username'
                            })

                            .populate({
                                path: 'myWork.OriginalService',
                                options: { strictPopulate: false },
                            })
                            .populate({
                                path: 'myWork.serviceBookedby',
                                options: { strictPopulate: false },
                                select: 'email imageURL username'
                            })
                            .populate({
                                path: 'myWork.serviceProvideBy',
                                options: { strictPopulate: false },
                                select: 'email imageURL username'
                            });


                        if (userExist) {
                            res.json({ data: 'success', bookservice: userExist.myBookService, mywork: userExist.myWork })

                        } else {
                            res.json({ data: 'userNotFound' })
                        }
                    }
                })
            } catch (error) {
                console.log(error)
                res.status(500).json({ data: 'serverError' })
            }
        })
    });










//-------------- service update ---------------------------
routes
    .route('/serviceStateUpdate')
    .post(async (req, res) => {
        upload(req, res, async function (err) {
            try {
                jwt.verify(req.cookies.token, process.env.jwt_key, async (err, data) => {
                    if (err) {
                        res.status(200).json({ data: 'tokenExpired' })
                    } else {
                        let userExist = await login.findOne({ email: data.email, password: data.password })
                        if (userExist) {

                            let bookedservice 
                            let updateddata = userExist.myWork.map(item => {
                                if (item._id.toString() === req.body.ServiceID) {
                                    item.serviceState = req.body.state
                                    bookedservice = item
                                    return item
                                } else return item
                            })
                            userExist.myWork = updateddata
                            await userExist.save()



                            // update in booked by client

                            let bookerdby = await login.findById(bookedservice.serviceBookedby)
                            
                            let updateBookedbyService = bookerdby.myBookService.map(item => {
                                if (item.trackID === bookedservice.trackID) {
                                    item.serviceState = req.body.state 
                                    return item
                                } else return item
                            })
                            bookerdby.myBookService = updateBookedbyService
                            await bookerdby.save()

                            res.json({ data: 'success' })

                        } else {
                            res.json({ data: 'userNotFound' })
                        }
                    }
                })
            } catch (error) {
                console.log(error)
                res.status(500).json({ data: 'serverError' })
            }
        })
    });










module.exports = routes;