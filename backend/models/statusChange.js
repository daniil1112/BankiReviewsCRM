const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);


const statusChangeScheme = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
        unique: true
    },
    review: {
        type: Number,
        required: true
    },
    from:{
        type: Number,
        required: true
    },
    to:{
        type: Number,
        required: true
    },
    date:{
        type:String,
        default: Date
    }

});



statusChangeScheme.plugin(autoIncrement.plugin, 'statusChange');


mongoose.model('statusChange',statusChangeScheme );
