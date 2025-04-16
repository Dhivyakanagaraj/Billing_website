const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');

router.post('/create', billingController.createBill);
router.get('/all', billingController.getBills);

module.exports = router;
