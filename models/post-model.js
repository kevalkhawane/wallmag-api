const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        require:true
    },
    topic:{
        type:String        
    },
    part:{
        type:Number       
    },
    content:{
        type:String       
    },
    tags:{
        type:[String]   
    },
    haveContent:{
        type:Boolean    
    },
    lastUpdated: { 
        type: Date,
        default: Date.now 
    }
});

const PostModel = mongoose.model('Post',PostSchema);

module.exports = PostModel;