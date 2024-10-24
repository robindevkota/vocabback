const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  messages: [
    {
      senderId: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
