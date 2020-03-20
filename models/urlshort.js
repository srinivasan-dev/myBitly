const mongoose = require('mongoose');

const URLSchema = mongoose.Schema({
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        unique: true
    },
    clickCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type:Date, 
        required:true
    }
});

const URLModel = mongoose.model('urlshort', URLSchema);
module.exports = { URLModel };