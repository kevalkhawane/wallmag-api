const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema =new Schema({
    name: String,
    description: String,
    thumbnail: String    
})

const topic = mongoose.model('topic',topicSchema);

module.exports = topic;