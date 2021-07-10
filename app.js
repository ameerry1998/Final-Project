const express = require('express');
const expressLayouts = require("express-ejs-layouts");
const path = require('path'); //TODO where does this refer
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const auth = require('./config/auth.js');
const axios = require('axios');

const mongoDB_URI = 'mongodb://localhost/sequoia'
//const mongoDB_URI = process.env.MONGODB_URI

const mongoose = require('mongoose');
mongoose.connect(mongoDB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.connect( `mongodb+srv://${auth.atlasAuth.username}:${auth.atlasAuth.password}@cluster0-yjamu.mongodb.net/authdemo?retryWrites=true&w=majority`);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:')); //TODO does 'on' represent a conditional error?
db.once('open', function () {
    console.log(`Successfully connected to db@${mongoDB_URI}`)
});

const authRouter = require('./routes/authentication');
const isLoggedIn = authRouter.isLoggedIn
const loggingRouter = require('./routes/logging');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const toDoRouter = require('./routes/todo');
const toDoAjaxRouter = require('./routes/todoAjax');
const wordSearchRouter = require('./routes/wordsearch');
const eventRouter = require('./routes/event');

const app = express(); //TODO should look up what this implies

// templating/view engine setup
app.set('views', path.join(__dirname, 'views')); //TODO as well as the set command
// app.set('layout', './layouts/full-width') //doesn't exist yet
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(authRouter)
app.use(loggingRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/todo', toDoRouter);
app.use('/todoAjax', toDoAjaxRouter);
app.use('/wordsearch', wordSearchRouter);
app.use('/event',eventRouter)

const User = require('./models/User');
const Vendor = require('./models/Vendor');
const BookedDates = require('./models/BookedDates');
const Event = require('./models/Event');
const SearchHistory = require('./models/SearchHistory.js');

// ####################

app.get('/profiles', //TODO syntax of get takes three arguments?
    isLoggedIn,
    async (req, res, next) => {
        try {
            res.locals.profiles = await User.find({}) //TODO What is find
            res.render('profiles')
        } catch (e) {
            next(e) //TODO how to use next
        }
    }
)

app.use('/publicprofile/:userId',
    async (req, res, next) => {
        try {
            let userId = req.params.userId
            res.locals.profile = await User.findOne({ _id: userId })
            res.render('publicprofile')
        } catch (e) {
            console.log("Error in /profile/userId:")
            next(e)
        }
    }
)


app.get('/profile',
    isLoggedIn,
    async (req, res) => {
        res.locals.history = await SearchHistory.find({userId: req.user._id})
        res.render('profile')
    })

app.get('/editProfile',
    isLoggedIn,
    (req, res) => res.render('editProfile'))

app.post('/editProfile',
    isLoggedIn,
    async (req, res, next) => {
        try {
            let username = req.body.username
            let age = req.body.age
            req.user.userType = req.body.User_Type
            req.user.username = username
            req.user.age = age
            req.user.imageURL = req.body.imageURL
            await req.user.save()
            res.redirect('/profile')
        } catch (error) {
            next(error)
        }
    })

app.post('/vendorHelper',
    isLoggedIn,
    async (req, res, next) => {
        const vendor_data = {
            name: req.body.business_name,
            industry: req.body.business_type,
            times: req.body.monday_hour1 +" " + req.body.monday_ampm1 + " - " + req.body.monday_hour2 + " " + req.body.monday_ampm2
            + " | " + req.body.tuesday_hour1 + " " + req.body.tuesday_ampm1 + " - " + req.body.tuesday_hour2 + " " +req.body.tuesday_ampm2
            + " | " + req.body.wednesday_hour1 + " " + req.body.wednesday_ampm1 + " - " + req.body.wednesday_hour2 + " " + req.body.wednesday_ampm2
            + " | " + req.body.thursday_hour1 + " " + req.body.thursday_ampm1 + " - " + req.body.thursday_hour2 + " " + req.body.thursday_ampm2
            + " | " + req.body.friday_hour1 + " " + req.body.friday_ampm1 + " - " + req.body.friday_hour2 + " " + req.body.friday_ampm2
            + " | " + req.body.saturday_hour1 + " " + req.body.saturday_ampm1 + " - " + req.body.saturday_hour2 + " " + req.body.saturday_ampm2
            + " | " + req.body.sunday_hour1 + " " + req.body.sunday_ampm1 + " - " + req.body.sunday_hour2 + " " + req.body.sunday_ampm2,
            description: req.body.business_description,
            userId: req.user._id,
            phone_number: req.body.phone_number,
            Address: req.body.Address
        }
        const newVendor = new Vendor(vendor_data)
        await newVendor.save()
        console.log(req.body)
        res.locals.body = req.body
        try {
            res.render('vendorInfo')
        } catch (error) {
            next(error)
        }
})



app.post('/vendorConfirm',
    isLoggedIn,
    async (req, res, next) => {
        try {
            res.render('index')
        } catch (error) {
            next(error)
        }
})

app.post('/BookedDatesSave',
    isLoggedIn,
    async (req, res, next) => {
        try {
            const bookeddatesdata = {
                dateList: req.body.bookDatesDB,
                userId: req.user._id  
            }
            const newBookedDates = new BookedDates(bookeddatesdata)
            await newBookedDates.save()
            res.redirect('/profile')
        } catch (error) {
            next(error)
        }
    })


app.post('/EventSave',
    isLoggedIn,
    async (req, res, next) => {
        try {
            const eventdata = {
                creatorName: req.body.fullName,
                creatorNumber: req.body.phoneNumber,
                date: req.body.eventDate,
                venue: req.body.venueName,
                Ground_transportation: req.body.Ground_transportation,
                Photography: req.body.Photography,
                Florist: req.body.Florist,
                Catering: req.body.Catering,
                Band: req.body.Band,
                DJ: req.body.DJ,
                Ice_sculpture: req.body.Ice_sculpture,
                description: req.body.bio,
                userId: req.user._id  
            }
            // const newEvent = new Event(eventdata)
            // await newEvent.save()
            new Event(eventdata).save()
            res.redirect('/profile')
        } catch (error) {
            next(error)
        }
})






// app.post('/vendorHelper', (req,res) => {
//     res.locals.body = req.body
//     res.render('vendorInfo')
// })


app.use('/data', (req, res) => {
    res.json([{ a: 1, b: 2 }, { a: 5, b: 3 }]);
})

app.get("/test", async (req, res, next) => {
    try {
        const u = await User.find({})
        console.log("found u " + u)
    } catch (e) {
        next(e)
    }

})



app.get('/apiTest',
    isLoggedIn,
    (req, res, next) => {

        res.render('apiTest')
    })

app.post('/covidfacts', async (req, res, next) => {
    try {
        let response = await axios.get(`https://api.covidtracking.com/v1/us/${req.body.date}.json`);
        res.json(response.data);
    } catch (e) {
        next(e)
    }
});


app.get("/about", (request, response) => {
    response.render("about");
  });



app.get("/eventorganizer",
function (req, res){res.render("eventorganizer");});

app.get("/vendor", (request,response) => {
    response.render("vendor")
  })
  


app.get("/calendar", (request,response) => {
    response.render("calendar")
  })



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;