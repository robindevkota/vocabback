const Word = require('../models/Word');

// Fetch all words for a specific user
exports.getWords = async (req, res) => {
  try {
    const words = await Word.find({ userId: req.user._id }).sort({createdAt:-1});
    res.json(words);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching words' });
  }
};
// Fetch a friend's words by their user ID
// Fetch a friend's words by their user ID
exports.getFriendWords = async (req, res) => {
  const { friendUserId } = req.params;

  try {
    const friendWords = await Word.find({ userId: friendUserId });

    if (!friendWords || friendWords.length === 0) {
      return res.status(404).json({ message: 'Friend\'s word collection is empty or not found' });
    }

    res.json(friendWords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching friend\'s words' });
  }
};


// Save a new word for a specific user
// Save a new word for a specific user
exports.addWord = async (req, res) => {
  try {
    const { word } = req.body;

    // Check if the word already exists for this user
    const existingWord = await Word.findOne({ word: word.trim().toLowerCase(), userId: req.user._id });
    if (existingWord) {
      return res.status(400).json({ message: 'Word already exists in your collection' });
    }

    const wordData = {
      ...req.body,
      userId: req.user._id // Add the user ID to the word data
    };
    
    const newWord = new Word(wordData);
    await newWord.save();
    res.status(201).json(newWord);
  } catch (error) {
    res.status(500).json({ message: 'Error adding word' });
  }
};



// Update a word (handles both full and partial updates)

// Update a word (handles both full and partial updates)
// Backend changes (wordController.js)
exports.updateWord = async (req, res) => {
  const { id } = req.params;

  try {
    // First verify the word belongs to the user
    const existingWord = await Word.findOne({ _id: id, userId: req.user._id });
    if (!existingWord) {
      return res.status(404).json({ message: 'Word not found or unauthorized' });
    }

    // Check if the word itself is being updated
    if (req.body.word && req.body.word !== existingWord.word) {
      const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${req.body.word}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      const audioUrl = data[0]?.phonetics?.find(p => p.audio)?.audio || '';
      const pronunciation = data[0]?.phonetics?.find(p => p.text)?.text || '';
      const partsOfSpeech = [...new Set(data[0]?.meanings.map(m => m.partOfSpeech))].join(', ');

      // Update the word details and reset meanings and examples
      req.body = {
        ...req.body,
        audioUrl,
        pronunciation,
        partsOfSpeech,
        originalMeanings: data[0]?.meanings || [],
        meanings: '', // Reset meanings
        examples: ''  // Reset examples
      };
    }

    const updatedWord = await Word.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedWord) {
      return res.status(404).json({ message: 'Word not found or unauthorized' });
    }

    res.json(updatedWord);
  } catch (error) {
    res.status(500).json({ message: 'Error updating word' });
  }
};

// Delete a word
exports.deleteWord = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Word.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!result) {
      return res.status(404).json({ message: 'Word not found or unauthorized' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting word' });
  }
};