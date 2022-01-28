const express = require('express');
const bodyParser = require('body-parser');
const session = require("express-session");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const path = require("path");

const exportFunction = require('./routes/service/sheets')



// Поддержка .env файлов
let dotenv = require('dotenv');
dotenv.config({path: path.join(__dirname, "/.env")});


const app = express();

const connectionDB = function(){
    mongoose.connect(process.env.DB_URL,{
        useUnifiedTopology: true,
        useNewUrlParser: true,
        reconnectTries: 30,
        reconnectInterval: 500,
        server: {
            socketOptions: {
                socketTimeoutMS: 0,
                connectTimeoutMS: 0
            }
        }
    }).catch(error =>{
        connectionDB();
    });
};

connectionDB();

mongoose.set('useCreateIndex', true);
if (process.env.PRODUCTION === 'false')  mongoose.set("debug", true);

require('./models/table')
require('./models/ip')
require('./models/profile')
require('./models/bankSelect')
require('./models/TownSelect')
require('./models/officeSelect')
require('./models/dispenserSelect')
require('./models/statusChange')
require('./models/Fio')

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true,limit: '50mb'}));
app.use(cookieParser());
app.use('/',require('./routes/index'));


app.listen(4000, async (req,res)=>{
    console.log("Сервер запущен на порту 4000");

    setInterval(exportFunction, 60*60*1000)

    process.on('SIGINT', async ()=>{
        if (mongoose.connection.readyState !==0) await mongoose.connection.close();
        console.log("Сервер завершил работу");
        process.exit();
    }).on('uncaughtException',async (err) =>{
        if (mongoose.connection.readyState !==0) await mongoose.connection.close();
        console.log(err, " Uncaught Exception thrown");
        process.exit();
    }).on('unhandledRejection',async (reason, p)=>{
        //if (mongoose.connection.readyState !==0) await mongoose.connection.close();
        console.error(reason, 'Unhandled Rejection at Promise', p);
    })
});