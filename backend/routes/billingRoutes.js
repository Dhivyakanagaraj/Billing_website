const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const Bill = require('../models/Bill');

router.post('/create', billingController.createBill);
router.get('/all', billingController.getBills);
router.delete('/delete/:id', billingController.deleteBill);


module.exports = router;
