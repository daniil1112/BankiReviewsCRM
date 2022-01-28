const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const tableDB = mongoose.model('table');
const profileDB = mongoose.model('profile');
const ipDB = mongoose.model('ip');
const statusChangeDB = mongoose.model('statusChange')


router.post('/setTitleTextAndBank', async (req, res) => {


    const {user,bank,title,text, mark, info, gender, town, recommendedAge, dateEvent, office, channels, dispenser, service} = req.body;

    // if (user != 1) return res.json({error: true})

    const result = await tableDB.create( {
        bank,title,text, mark, info, gender, town, recommendedAge, dateEvent, office, channels, dispenser, service
    })

    return res.json({result})
})
router.post('/updateReview', async (req, res) => {

    const {user,bank,title,text, mark, info, gender, town, recommendedAge, dateEvent, office, channels, dispenser, service, _id} = req.body;


    const table = await tableDB.findById(_id)

    if (!table) return res.code(400).json({})

    table.bank = bank
    table.channels = channels
    table.gender = gender
    table.mark = mark
    table.info = info
    table.office = office
    table.dispenser = dispenser
    table.recommendedAge = recommendedAge
    table.title = title
    table.text = text
    table.town = town
    table.dateEvent = dateEvent
    table.service = service


    // if (user != 1) return res.json({error: true})

    const result = await table.save()

    return res.json({result})
})



router.post('/loadTable', async (req,res) => {
    const {user} = req.body;

    const rows = await tableDB.find()

    return res.json({rows})
});

router.post('/setStep2', async (req,res) => {
    const {user, _id} = req.body;

    let row = await tableDB.findById(_id)

    if (parseInt(user) === 1) row.step = 2

    row = await row.save()

    return res.json({row})
})

router.post('/setStep3', async (req,res) => {
    const {user, _id} = req.body;

    let row = await tableDB.findById(_id)

    if (parseInt(user) === 2) row.step = 3

    row = await row.save()

    if (row) return res.json({success: true})
    return res.json({success: false})
})
router.post('/setStep4', async (req,res) => {
    const {user, _id} = req.body;

    let row = await tableDB.findById(_id)

    if (parseInt(user) === 3) row.step = 4

    row = await row.save()

    return res.json({row})
})

router.post('/assignIp', async (req,res) => {
    const {user, _id, ip} = req.body;

    if (parseInt(user) !== 3) return res.json({success: false})

    let row = await tableDB.findById(_id)
    let ipRow = await ipDB.findById(ip)

    if (!row || !ipRow) return res.json({success: false})

    if (row.ip){
        let oldOpRow = await ipDB.findById(row.ip)
        oldOpRow.usedIn = 0
        oldOpRow.used = false
        await oldOpRow.save()
    }
    ipRow.usedIn = row._id;
    ipRow.used = true
    row.ip = ip



    row = await row.save()
    ipRow = await ipRow.save()

    if (row && ipRow) return res.json({success: true})
    return res.json({success: false})
})

router.post('/setPhone', async (req,res) => {
    const {user, _id, phone} = req.body;

    if (parseInt(user) !== 3) return res.json({success: false})

    let row = await tableDB.findById(_id)

    if (row) {
        row.phone = phone
        await row.save()
        return res.json({success: true})
    }

    return res.json({success: false})
})

router.post('/setLink', async (req,res) => {
    const {user, _id, link} = req.body;

    if (parseInt(user) !== 3) return res.json({success: false})

    let row = await tableDB.findById(_id)

    if (row) {
        row.reviewLink = link
        row.reviewAddDate = new Date()
        await row.save()
        return res.json({success: true})
    }

    return res.json({success: false})
})

router.post('/updateModerate', async (req,res) => {
    const {user, _id, moderateStatus, moderateAsk, moderateAnswer} = req.body;

    if (parseInt(user) !== 4) return res.json({success: false})

    let row = await tableDB.findById(_id)


    if (row) {
        let firstStatus = row.moderateStatus
        row.moderateStatus = moderateStatus
        row.moderateAsk = moderateAsk
        row.moderateAnswer = moderateAnswer

        if (moderateStatus === 4 || moderateStatus === 5){
            const ip = await ipDB.findById(row.ip)
            ip.adopted = true;
            ip.save()
        } else {
            const ip = await ipDB.findById(row.ip)
            ip.adopted = false;
            ip.save()
        }

        await row.save()
        if (firstStatus !== row.moderateStatus){
            statusChangeDB.create({
                review: row._id,
                from: firstStatus,
                to: row.moderateStatus
            })
        }



        return res.json({success: true})


    }

    return res.json({success: false})
})


router.post('/deleteRow', async (req,res) => {
    const {user, _id} = req.body;

    if (parseInt(user) !== 1) return res.json({success: false})

    let row = await tableDB.findById(_id)

    if (row) {
        await row.remove()
        return res.json({success: true})
    }

    return res.json({success: false})
})

router.post('/setBreakage', async (req,res) => {
    const {user, _id} = req.body;

    if (parseInt(user) !== 3) return res.json({success: false})

    let row = await tableDB.findById(_id)

    if (row.profile) {
        let profile = await profileDB.findById(row.profile)
        profile.breakage = true
        await profile.save()
    }
    if (row.ip) {
        let ip = await ipDB.findById(row.ip)
        ip.breakage = true
        ip.used = false
        ip.usedIn = 0
        await ip.save()
    }

    row.ip = 0

    row.phone = ''

    row = await row.save()


    if (row) {
        return res.json({success: true})
    }

    return res.json({success: false})
})


router.post('/loadChanges', async (req,res) => {
    const changes = await statusChangeDB.find().sort('-_id')
    return res.json({changes})
})

router.post('/unsignIp', async (req, res) => {
    const {user, _id} = req.body
    if (parseInt(user) !== 3) return res.json({success: false})

    const row = await tableDB.findById(_id);

    const ip = await ipDB.findById(row.ip)

    ip.used = false

    ip.usedIn = -1

    await ip.save()


    row.ip = undefined;


    await row.save()

    return res.json({success: true})
})








module.exports = router;