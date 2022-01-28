const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);




const fioScheme = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
        unique: true
    },
    FIO: {
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    used:{
        type: Boolean,
        default: false
    }

});



fioScheme.plugin(autoIncrement.plugin, 'fio');


mongoose.model('fio',fioScheme );
