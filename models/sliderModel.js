const mongoose = require('mongoose');

const SliderSchema = new mongoose.Schema({
    tags:{
        type:[String],
        required:true
    },
    topic:{
        type:String,
        require:true
    },
    tag:{
        type:String,
        require:true
    },
    post1:{
        type:String,
        required:true       
    },
    post2:{
        type:String,
        required:true       
    },
    post3:{
        type:String,
        required:true       
    },
    post4:{
        type:String,
        required:true       
    },
    post5:{
        type:String,
        required:true       
    },
    topic1:{
        type:String,
        required:true       
    },
    topic2:{
        type:String,
        required:true       
    },
    topic3:{
        type:String,
        required:true       
    },
    topic4:{
        type:String,
        required:true       
    },
    topic5:{
        type:String,
        required:true       
    }
});

const SliderModel = mongoose.model('SliderModel',SliderSchema);

module.exports = SliderModel;

