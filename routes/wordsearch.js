/*
  wordsearch.js -- Router for WordSearch
  used in Ajax calls from the client
*/
const express = require('express');
const router = express.Router();
const LegalWord = require('../models/LegalWord');
const SearchHistory = require('../models/SearchHistory');


isLoggedIn = (req, res, next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

// get the value associated to the key
router.get('/',
  async (req, res, next) => {
    // let target = req.findThisWord || "0"
    res.locals.searchResults = ""
    res.render('wordSearchClient')
  });

// Serves the search results here
router.post('/',
  async (req, res, next) => {
    console.log(`req.body=${JSON.stringify(req.body)}`)
    let words = await LegalWord.find().legalInsideChange(req.body.findThisWord).sort('length').sort('word')
    let newHistory = new SearchHistory(
      {
        userId: req.user._id,
        queryDate: new Date(),
        query: req.body.findThisWord,
      })
    await newHistory.save()// Log to search history
    res.json(words)
  });

// We should not be adding words to the dictionary...yet
// // /* add the value in the body to the list associated to the key */
// // router.post('/',
// //   async (req, res, next) => {
// //       console.log(`req.body=${JSON.stringify(req.body)}`)
// //       const todo = new LegalWord(
// //         {item:req.body.item,
// //          createdAt: new Date(),
// //          complete: false,
// //          userId: req.user._id
// //         })
// //       let item = await todo.save();
// //       res.json(item)
// // });

router.get('/testing', (req, res) => res.json(['it', 'works']))

// or removing words
// // router.post('/remove',
// //   async (req, res, next) => {
// //     try {
// //       let itemId = req.body.itemId
// //       console.log("inside /todo/remove/:itemId")
// //       let result = await ToDoItem.remove({_id:itemId});
// //       res.json(result)
// //     }catch(e){
// //       next(e)
// //     }
// // });


module.exports = router;
