const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  roomUUID: {
    type: String, 
    ref:'Room',
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
