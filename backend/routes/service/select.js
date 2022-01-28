const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')



const selectBankDB = mongoose.model('bankSelect');
const selectTownDB = mongoose.model('townSelect')
const selectOfficeDB = mongoose.model('officeSelect')
const selectDispenserDB = mongoose.model('dispenserSelect')
const selectFIODB = mongoose.model('fio')


router.post('/loadSelect', async (req, res) => {
    const bankSelect = await selectBankDB.find();

    const townSelect = await  selectTownDB.find()

    const officeSelect = await selectOfficeDB.find()

    const dispenserSelect = await selectDispenserDB.find()

    return res.json({bankSelect, townSelect, officeSelect, dispenserSelect})
});



router.post('/addBankSelect' , async (req, res) => {
    const {user, text, value, link} = req.body

    if (!user || !text || !value || !link) return res.json({error: true, message: 'Проверьте входные параметры!'})

    const result = await selectBankDB.create({
        text, value, link
    })

    return res.json({result})
})

router.post('/addTownSelect' , async (req, res) => {
    const {user, text, value, bankId} = req.body

    if (!user || !text || !value || !bankId) return res.json({error: true, message: 'Проверьте входные параметры!'})

    const result = await selectTownDB.create({
        text, value, bankId
    })

    return res.json({result})
})

router.post('/addOfficeSelect' , async (req, res) => {
    const {user, text, value, bankId, townId} = req.body

    if (!user || !text || !value || !bankId || !townId) return res.json({error: true, message: 'Проверьте входные параметры!'})

    const result = await selectOfficeDB.create({
        text, value, bankId, townId
    })

    return res.json({result})
})

router.post('/addDispenserSelect' , async (req, res) => {
    const {user, text, value, bankId, townId} = req.body

    if (!user || !text || !value || !bankId || !townId) return res.json({error: true, message: 'Проверьте входные параметры!'})

    const result = await selectDispenserDB.create({
        text, value, bankId, townId
    })

    return res.json({result})
})

router.post('/importFIO', async (req,res) => {
    const FIOArray = req.body.FIOArray


    FIOArray.forEach(e => {
        let arr = e.split(':')

        selectFIODB.create({
            FIO: arr[0],
            gender: arr[1]
        })
    })

    res.json({result:true})

})

router.post('/countFIO', async (req,res) => {
    const count = await selectFIODB.count({used: false})
    return res.json({count})
})


module.exports = router;