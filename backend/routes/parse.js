const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const request = require('request')
const cheerio = require('cheerio')

const Iconv = require("iconv-lite")

const emailExistence = require('email-existence')
var emailCheck = require('email-check');
const selectFIODB = mongoose.model('fio')



const tableDB = mongoose.model('table');

async function getPostPage(url, decodeUTF = false){
    return new Promise((resolve, reject) => {
        request({
            encoding: null,
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; SM-G550T1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Mobile Safari/537.36',
            }
        }, (error, response, body) => {
            if (error) return reject(error)

            const bodyDecoded = Iconv.decode(body, "win1251");

            return resolve(cheerio.load(bodyDecoded, {decodeEntities: false}))
        })
    })
}

async function getPage(url, decodeUTF = false){
    return new Promise((resolve, reject) => {
        request({
            encoding: null,
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; SM-G550T1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Mobile Safari/537.36',
            }
        }, (error, response, body) => {
            if (error) return reject(error)

            const bodyDecoded = Iconv.decode(body, "win1251");

            return resolve(cheerio.load(bodyDecoded, {decodeEntities: false}))
        })
    })
}

function getProfileLink($) {
    const selector = '[data-test=responses-user-link]'
    return  $(selector).attr('href')

}

function getReputation($){
    const selector = '#user-thank-details'
    return  $(selector)
}

function acceptMark($){
    const selector = '[data-test="responses-rating-grade"]'
    const markclass =  $(selector).attr('class')
    if (markclass.includes('rating-grade--hollow')) return false
    return true

}

function isBankAnswer($){
    const selector = '[id="bankAnswer"]'
    const res =  $(selector)


    return res
}



router.post('/parse', async (req, res) => {
    const {checkLink} = req.body
    const review = await getPage(checkLink)
    const link = getProfileLink(review)
    const profile = await getPage(`https://www.banki.ru${link}` )
    const reputation = getReputation(profile)

    isBankAnswer(review)
    if (reputation.text().match('Запрещена множественная регистрация аккаунтов одним пользователем')) return res.json({ban: true})
    return res.json({ban: false, review:review, mark: acceptMark(review)})
})

router.post('/loadFIO', async (req,res) => {
    const gender = req.body.gender
    const result = await selectFIODB.findOneAndUpdate({
        $and:[
            {gender:gender},
            {used: false}
        ]
    },{
        used: true
    },
        {
            new: true
        })
    if (result && result.FIO) return res.json({result:result.FIO})
    return res.json({result:''})
})

router.post('/parseFIO', async (req, res) => {
    const {gender} = req.body
    request.post({
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        url: 'https://api.randomdatatools.ru/',
        body: `gender=${gender}`
    }, (error, response, body) => {



        return res.json({result: JSON.parse(body)})

    })

})

router.post('/parseLogin', async (req, res) => {
    const {firstname,surname, patronymic, birthday} = req.body
    request.post({
        headers: {'content-type' : 'application/x-www-form-urlencoded',
            'x-requested-with': 'XMLHttpRequest'
        },
        url:     'https://genword.ru/generators/login/new/',
        body:    `firstname=${firstname}&surname=${surname}&patronymic=${patronymic}&nickname=&birthday=${birthday}`
    }, (error, response, body) => {
        if (error) return

        const regex = /"login":"(.*?)"/gm


        return res.json({result: body.match(regex)[1].split('"login":"')[1].split('"')[0]})


    })
})


router.post('/checkMail', async (req, res) => {
    const {mail} = req.body


    let login = mail.split('@')[0].trim()
    let service = mail.split('@')[1].trim()

    if (service === 'yandex.ru' || service === 'ya.ru'){
        request.get({
            url:'https://passport.yandex.ru/registration/mail?from=mail&origin=home_desktop_ru&retpath=https%3A%2F%2Fmail.yandex.ru%2F&backpath=https%3A%2F%2Fyandex.ru'
        }, (error, response, body) => {
            if (error) return res.json({
                checkStart: true,
                checkEnd: false
            })

            if (!JSON.parse(JSON.stringify(response.headers))['set-cookie'] ||!JSON.parse(JSON.stringify(response.headers))['set-cookie'][1] || !body.match(/data-csrf="(.*?)"/) || !body.match(/data-csrf="(.*?)"/)[1]
            || !body.match(/input type="hidden" name="track_id" value="(.*?)"/) || !body.match(/input type="hidden" name="track_id" value="(.*?)"/)[1]
            ) return res.json({
                checkStart: true,
                checkEnd: false
            })
            const header = JSON.parse(JSON.stringify(response.headers))['set-cookie'][1].split(';')[0]
            const csrf = body.match(/data-csrf="(.*?)"/)[1]
            const track = body.match(/input type="hidden" name="track_id" value="(.*?)"/)[1]
            request.post({
                url: 'https://passport.yandex.ru/registration-validations/login',
                headers:{
                    Cookie: header+';',
                    'X-Requested-With': 'XMLHttpRequest',
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 YaBrowser/19.12.3.332 (beta) Yowser/2.5 Safari/537.36'
                },
                body: `csrf_token=${csrf}&track_id=${track}&login=${login}`
            }, (error, response, body) => {
                if (error || !body) return res.json({
                    checkStart: true,
                    checkEnd: false
                })
                let parsedBody = JSON.parse(body)

                if (parsedBody && parsedBody[0] && typeof parsedBody[0] === 'string' &&  parsedBody[0] === 'login.not_available') {
                    return res.json({
                        checkStart: true,
                        checkEnd: true,
                        free: false
                    })
                } else if (parsedBody && parsedBody.id && parsedBody.status && parsedBody.status === 'ok'){
                    return res.json({
                        checkStart: true,
                        checkEnd: true,
                        free: true
                    })
                } else {
                    return res.json({
                        checkStart: true,
                        checkEnd: false,
                    })
                }
            })
        })
    } else if (service === 'rambler.ru'
        || service === 'lenta.ru'
        || service === 'autorambler.ru'
        || service === 'myrambler.ru'
        || service === 'ro.ru'
        || service === 'rambler.ua'
    ) {
        request.post({
            url: 'https://id.rambler.ru/jsonrpc',
            headers:{
                'Content-Type': 'application/json'
            },
            body: `{"method":"Rambler::Id::login_available","params":[{"login":"${login}@${service}"}],"rpc":"2.0"}`
        }, (error, response, body) => {
            if (error || !body || !JSON.parse(body))  return res.json({
                checkStart: true,
                checkEnd: false,
            })

            const parsedBody = JSON.parse(body)

            if (parsedBody.result && parsedBody.result.status === 'OK')  {
                return res.json({
                    checkStart: true,
                    checkEnd: true,
                    free: false
                })
            } else if (parsedBody.result && parsedBody.result.status === 'ERROR') {
                return res.json({
                    checkStart: true,
                    checkEnd: true,
                    free: true
                })
            } else {
                return res.json({
                    checkStart: true,
                    checkEnd: false,
                })
            }
        })
    } else if (
        service === 'mail.ru'
        || service === 'bk.ru'
        || service === 'inbox.ru'
        || service === 'list.ru'

    ) {
        request.get({
            url: `https://account.mail.ru/api/v1/user/exists?email=${login}@${service}`,
            proxy: 'http://moiplansh028:H3o1SkD@77.220.205.33:65233'
        }, (error, response, body) => {
            let parsedBody = JSON.parse(body)

            if (error || !body || !JSON.parse(body) || !JSON.parse(body).body || typeof JSON.parse(body).body.exists !== 'boolean')  return res.json({
                checkStart: true,
                checkEnd: false,
            })


            let alternatives = []

            if (parsedBody.body && parsedBody.body.alternatives) alternatives = parsedBody.body.alternatives



            if (!parsedBody.body.exists) {
                return res.json({
                    checkStart: true,
                    checkEnd: true,
                    free: true,
                    alternatives
                })
            } else {
                return res.json({
                    checkStart: true,
                    checkEnd: true,
                    free: false,
                    alternatives
                })
            }
        })
    } else {
        return res.json({
            checkStart: false,
        })
    }

})


module.exports = router;