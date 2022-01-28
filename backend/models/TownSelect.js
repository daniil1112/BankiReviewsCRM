const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);


const Schema = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
        unique: true
    },
    bankId: {
        type:Number,
        required: true
    },
    text: {
        type:String,
        required: true
    },
    value: {
        type:String,
        required: true
    },

});



Schema.plugin(autoIncrement.plugin, 'townSelect');


mongoose.model('townSelect',Schema );
