const mongoose = require("mongoose");


const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);




const statScheme = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
        unique: true
    },
    reviews:{
        type: Number,
        default: 0
    },
    profilesAdded:{
        type: Number,
        default: 0
    },
    ipMoneyPay:{
        type: Number,
        default: 0
    },
    ipMoneySend:{
        type: Number,
        default: 0
    },
    reviewsAddMoneySend:{
        type: Number,
        default: 0
    },

    dateAdd:{
        type:String,
        default: Date
    }

});



statScheme.plugin(autoIncrement.plugin, 'stats');


mongoose.model('stats',statScheme );
