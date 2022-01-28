const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const ipDB = mongoose.model('ip');


router.post('/add', async (req, res) => {
    const {user, lines} = req.body;

    if (!user || parseInt(user) !== 3 ) return res.json({success: false})


    lines.forEach( line => {
        let arr = line.split(':');

        let ip = arr[0];

        let town = arr[4] ? arr[4] : ''

        ipDB.create({
            string: line,
            ip,town
        })

    })

    return res.json({success: true})
});

router.post('/update', async (req, res) => {
    const {user, ipString, _id} = req.body;

    if (!user || parseInt(user) !== 3 ) return res.json({success: false})

    let ip = await  ipDB.findById(_id)

    if (!ip ) return res.json({success: false})


    let arr = ipString.split(':');

    let ipNew = arr[0];

    let town = arr[4] ? arr[4] : ''

    ip.string = ipString
    ip.ip = ipNew
    ip.town = town

    const result =await ip.save()


    return res.json({success: true})
});



router.post('/loadAll', async (req, res) => {
    const {user} = req.body;

    // if (!user ) return res.json({success: false})

    const ips = await ipDB.find().sort('-_id')


    return res.json({ips})
});

router.post('/deleteIp', async (req, res) => {
    const {user, _id} = req.body;

    if (!user || parseInt(user) !== 3 ) return res.json({success: false})

    const ip = await ipDB.findById(_id)

    if (!ip) return res.json({success: false})

    const result = await ip.remove()

    if (result) return res.json({success: true})

    return res.json({success: false})


});

router.post('/setUserAgent', async (req, res) => {
    const {user, _id, userAgent} = req.body;

    if (!user || parseInt(user) !== 3 ) return res.json({success: false})

    const ip = await ipDB.findById(_id)

    if (!ip) return res.json({success: false})

    ip.userAgent = userAgent

    const result = await ip.save()

    if (result) return res.json({success: true})

    return res.json({success: false})

});

router.post('/checkUserAgent', async (req, res) => {
    const {user, userAgent} = req.body;

    if (!user || parseInt(user) !== 3 ) return res.json({success: false})

    const count = await ipDB.count({userAgent})

    return res.json({count})

});





module.exports = router;