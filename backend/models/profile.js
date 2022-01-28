const mongoose = require("mongoose");

const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection);



const profileScheme = new mongoose.Schema({
    _id:{
        type: Number,
        required: true,
        unique: true
    },
    FIO:{
        type: String
    },
    mail:{
        type: String
    },
    login:{
        type: String
    },
    password:{
        type: String
    },
    birthDate:{
        type:String
    },
    age:{
        type:Number
    },
    gender:{
        type:String
    },
    assigned:{
        type: Boolean,
        default: false
    },
    reviewId:{
        type: Number
    },
    breakage:{
        type: Boolean,
        default: false
    },

    dateAdd:{
        type:String,
        default: Date
    }

});



profileScheme.plugin(autoIncrement.plugin, 'profile');


mongoose.model('profile',profileScheme );
