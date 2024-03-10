const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({

    roomId: {
        type: String,
        required: true,
    },
    roomUUID: {
        type: String,
        required: true,
    },
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;