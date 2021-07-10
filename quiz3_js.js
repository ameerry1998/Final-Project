const walkingLog = require('./models/Walk.js')

app.get('/walkingLog',isLoggedIn,
  async (req,res,next) => {
    res.locals.walks = await walkingLog.find({})
    res.render('walkingLog')
  }
)

app.post('/walkingLog',
  isLoggedIn,
  async (req,res,next) => {

    const walk_data = {
      date:req.body.date,
      steps:req.body.steps,
      minutes: req.body.minutes,
      speed: req.body.steps/ req.body.minutes,
    }
    const newWalk = new walkingLog(walk_data)
    await newWalk.save()

    res.redirect('/walkingLog')
  }
)





//schema


'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var WalkSchema = Schema( {
  date:String,
  steps:Number,
  minutes:Number,
  userId: ObjectId
} );

module.exports = mongoose.model( 'WalkSchema', WalkSchema );

