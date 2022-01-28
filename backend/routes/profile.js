const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const profileDB = mongoose.model('profile');
const tableDB = mongoose.model('table');


router.post('/add', async (req, res) => {
    const {user, FIO, mail, birthDate, age, password, gender, login} = req.body;


    const profile = await profileDB.create({
        FIO, mail, birthDate, age, password, gender, login
    })

    return res.json({profile})
})

router.post('/assign', async (req, res) => {
    const {user, rowId, profileId} = req.body;

    if (parseInt(user) !== 2) return res.json({success: false})

    try {
        let profile = await profileDB.findById(profileId)

        let tableRow = await tableDB.findById(rowId)

        profile.assigned = true
        profile.reviewId = tableRow._id

        profile = await profile.save()

        let oldProfile

        if (tableRow.profile) {
            oldProfile = await profileDB.findById(tableRow.profile);
            oldProfile.assigned = false
            oldProfile.reviewId = 0

            oldProfile = await oldProfile.save()
        }

        tableRow.profile = profile._id;

        tableRow = await tableRow.save()

        return res.json({success: true})
    } catch (e) {
        return res.json({success: false})
    }


})

router.post('/all', async (req, res) => {

    const profiles = await profileDB.find()

    return res.json({profiles})
})

router.post('/deleteRow', async (req,res) => {
    const {user, _id} = req.body;

    if (parseInt(user) !== 2) return res.json({success: false})

    let row = await profileDB.findById(_id)

    if (row) {
        await row.remove()
        return res.json({success: true})
    }

    return res.json({success: false})
})


router.post('/update', async (req,res) => {
    const {user, FIO, mail, birthDate, age, password, gender, _id, login} = req.body;

    if (parseInt(user) !== 2) return res.json({success: false})

    let row = await profileDB.findById(_id)

    if (row) {
        row.login = login
        row.FIO = FIO
        row.mail = mail
        row.birthDate = birthDate
        row.password = password
        row.gender = gender

        row = await row.save()
        if (row) return res.json({success: true})
        return res.json({success: false})
    }

    return res.json({success: false})
});

router.post('/updateBreakage', async (req,res) => {
    const {user, FIO, mail, password,_id} = req.body;

    if (parseInt(user) !== 2) return res.json({success: false})

    let row = await profileDB.findById(_id)

    if (row) {
        row.FIO = FIO
        row.mail = mail
        row.password = password
        row.breakage = false

        row = await row.save()
        if (row) return res.json({success: true})
        return res.json({success: false})
    }

    return res.json({success: false})
});


router.post('/unpin', async (req,res) => {
    const {user, _id} = req.body;

    if (parseInt(user) !== 2) return res.json({success: false})

    let row = await tableDB.findById(_id)

    if (row) {

        let profile = await profileDB.findById(row.profile)

        row.profile = 0


        profile.assigned = false
        profile.reviewId = 0

        row = await row.save()
        profile = await profile.save()

        if (row && profile) return res.json({success: true})
        return res.json({success: false})
    }

    return res.json({success: false})
});



module.exports = router;