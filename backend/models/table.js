const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);

const table = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
        unique: true
    },
    bank:{
        type: Number,
    },
    title:{
        type: String,
    },
    text:{
        type: String,
    },
    mark: {
        type: Number
    },
    info: {
        type: String
    },
    link:{
        type: String,
    },
    dateSetText:{
        type: String,
        default: Date
    },
    gender:{
        type: String
    },
    town:{
        type:Number
    },
    recommendedAge:{
        type: Number
    },
    dateEvent:{
        type: String
    },
    profile: {
        type: Number
    },
    office:{
        type: Number
    },
    dispenser:{
        type: Number
    },
    channels:{
        type: Array
    },
    service:{
        type: Array
    },
    ip:{
        type: Number
    },
    phone:{
      type: String,
    },
    reviewLink:{
        type: String
    },
    reviewAddDate:{
        type: String,
    },
    step: {
        type: Number,
        default: 1
    },
    moderateStatus:{
        type: Number,
        default: 1
    },
    moderateAsk:{
        type: String
    },
    moderateAnswer:{
        type: String
    }


});



table.plugin(autoIncrement.plugin, 'table');


mongoose.model('table',table );
