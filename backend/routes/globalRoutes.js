const express = require('express');
const router = express.Router();
const globalController = require('../controllers/globalController.js');

router.put('/putpriceState',globalController.setstatus);
router.get('/getpriceState',globalController.getstatus);
router.get('/printPDF',globalController.printPDF);
module.exports = router;