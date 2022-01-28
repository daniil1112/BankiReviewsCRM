const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);




const ipScheme = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
        unique: true
    },
    string:{
        type: String
    },
    ip:{
        type: String
    },
    town:{
        type: String
    },
    userAgent:{
        type: String,
    },
    used:{
        type:Boolean,
        default: false
    },
    usedIn:{
        type: Number
    },
    breakage:{
        type: Boolean,
        default: false
    },
    adopted:{
        //Больше не надо продлевать
        type: Boolean,
        default: false
    },
    dateAdd:{
        type:String,
        default: Date
    }

});



ipScheme.plugin(autoIncrement.plugin, 'ip');


mongoose.model('ip',ipScheme );
