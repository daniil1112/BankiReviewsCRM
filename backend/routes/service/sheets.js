const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const readline = require('readline');
const {google} = require('googleapis');
const fs = require('fs');

require('./../../models/table')
require('./../../models/ip')
require('./../../models/profile')
require('./../../models/bankSelect')
require('./../../models/TownSelect')
require('./../../models/officeSelect')
require('./../../models/dispenserSelect')
require('./../../models/statusChange')


const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = './googletoken.json';

const tableDB = mongoose.model('table');
const profileDB = mongoose.model('profile');
const ipDB = mongoose.model('ip');
const selectBankDB = mongoose.model('bankSelect');
const selectTownDB = mongoose.model('townSelect')
const selectOfficeDB = mongoose.model('officeSelect')
const selectDispenserDB = mongoose.model('dispenserSelect')
const dateformat = require('dateformat')


function generateFullDate(iso){
    let date = new Date(iso).toLocaleString("en-US", {timeZone: "Europe/Moscow"});
    return  dateformat(date,'dd.mm.yyyy HH:MM:ss')
}

function generateDate(iso){
    let date = new Date(iso).toLocaleString("en-US", {timeZone: "Europe/Moscow"});
    return  dateformat(date,'dd.mm.yyyy')
}

function getStatusText(val){
    if (val === 1) return 'Ожидает проверку'
    if (val === 2) return 'Проверяется'
    if (val === 3) return 'Зачтен'
    if (val === 4) return 'Отклонен'
    // if (val === 5) return 'Принят'
}
function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, 'http://localhost:4000');

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

async function addRows(auth) {
    const rows = await tableDB.find({})
    const profiles = await profileDB.find({})
    const ips = await ipDB.find({})
    const selectBank = await selectBankDB.find({})
    const selectTown = await selectTownDB.find({})
    let values = [
        [
            "№", "Дата создания", "Дата добавления", "банк", 'ссылка на отзыв', 'e-mail', 'ФИО', 'логин', 'Дата рождения', 'пароль', 'логин на Banki', 'телефон', 'IP', 'User agent', 'данные отзыва', 'дата события', 'город', 'оценка', 'заголовок', 'текст', 'вопрос модератора', 'ответ модератору', 'статус'
        ],

    ];
    let dateEvent
    let profile
    let town
    let moderateAsk
    let moderateAnswer
    let info
    let phone = ''
    let reviewLink = ''
    let ip
    let login = ''
    let password = ''
    let FIO = ''
    let mail = ''
    let ipStr = ''
    let userAgent = ''
    let dateBirth
    let factDate
    rows.forEach(e => {
        profile = e.profile ? profiles.find(n => n._id === e.profile) : false
        ip = e.ip ? ips.find(n => n._id === e.ip) : false
        if (profile) login = profile.login
        else login = ''
        if (profile) password = profile.password
        else password = ''
        if (profile) FIO = profile.FIO
        else FIO = ''
        if (profile) FIO = profile.FIO
        else FIO = ''
        if (profile) dateBirth = profile.birthDate
        else dateBirth = ''
        if (profile) mail = profile.mail
        else mail = ''
        if (ip) ipStr = ip.ip
        else ipStr = ''
        if (ip) userAgent = ip.userAgent
        else userAgent = ''
        phone = e.phone ? e.phone : ''
        reviewLink = e.reviewLink ? e.reviewLink : ''
        dateEvent = e.dateEvent ? e.dateEvent : ''
        town = selectTown.find(k => k._id === e.town).value
        moderateAsk = e.moderateAsk ? e.moderateAsk : ''
        moderateAnswer = e.moderateAnswer ? e.moderateAnswer : ''
        info = e.info ? e.info : ''
        factDate = e.reviewAddDate ? generateFullDate(e.reviewAddDate) : ' '

        values.push([
            `${e._id}`, `${generateDate(e.dateSetText)}`, `${factDate} ` ,`${selectBank.find(n => n._id === e.bank).value}`, `${reviewLink} `, `${mail} `, `${FIO} `, `${login} `, `${dateBirth} `,`${password}`, `${login} `, `${phone} `, `${ipStr} `, `${userAgent} `, `${info} `, `${dateEvent} `, `${town} `, `${e.mark}`, `${e.title} `, `${e.text} `, `${moderateAsk} `, `${moderateAnswer} `, `${getStatusText(e.moderateStatus)}`
        ])
    })

    const sheets = google.sheets({version: 'v4', auth});


    const resource = {
        values,
    };
    sheets.spreadsheets.values.update({
        spreadsheetId: '1dnb_fqocYtMZgqA-0hDnaYVZ3YLVfGhFomI4pFTxSh8',
        range: 'A1:Z1000',
        valueInputOption: 'USER_ENTERED',
        resource,
    }, (err, result) => {
        if (err) {
            // Handle error
            console.log(err);
        } else {
            console.log('%d cells updated.', result.updatedCells);
        }
    });
}

const exportFunction = async function() {

    fs.readFile('./googlecredentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), addRows);
    });





}


module.exports = exportFunction
// module.exports = router;