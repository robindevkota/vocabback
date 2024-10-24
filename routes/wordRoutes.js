const express = require('express');
const {
    protect,
    adminOnly,
    authorOnly,
  } = require("../middleware/authMiddleware");
const { getWords, addWord, updateWord, deleteWord,getFriendWords } = require('../controllers/wordController');
// Assuming you have auth middleware
const router = express.Router();

// All routes are protected and require authentication


// GET all words for the logged-in user
router.get('/words',protect, getWords);

// POST a new word for the logged-in user
router.post('/words', protect,addWord);

// PUT (update) a word owned by the logged-in user
router.put('/words/:id',protect, updateWord);
router.get('/words/friend/:friendUserId',protect, getFriendWords);
// DELETE a word owned by the logged-in user
router.delete('/words/:id',protect, deleteWord);

module.exports = router;