const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UUIDSchema =new Schema({
    uuid: String,
    bookmarks: [String],
    topics: [String],
    tags: [String]    
})

const UUID = mongoose.model('UUID',UUIDSchema);

module.exports = UUID;