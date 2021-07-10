var express = require('express');
const Vendor = require('../models/Vendor');
const BookedDate = require('../models/BookedDates');
const Event = require('../models/Event');
var router = express.Router();

router.get('/',
  isLoggedIn,
  async (req, res, next) => {
    res.render('event',{Vendors: await Vendor.find({}), BookedDates: await BookedDate.find({}), Event: await Event.find({})});
  });
module.exports = router;





























// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
 

// app.get('/event', 
//     isLoggedIn,
//     async (req, res, next) => {
//         try {
//             res.locals.events = await Vendor.find({})
//             // res.locals.events = "this is events"
//             // console.log("below is app.js events")
//             // console.log(res.locals.events)
//             // res.render('event')
//             res.locals("Your name is" + res.locals.events);
//         } catch (e) {
//             next(e) //TODO how to use next
//         }
//     }
// )