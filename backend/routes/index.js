const express = require("express");
const router = express.Router();

router.use('/table/', require('./table'));
router.use('/ip/', require('./ip'))
router.use('/parse/', require('./parse'));
router.use('/profile/', require('./profile'));
router.use('/service/', require('./service'));

module.exports = router;