const express = require('express');


const purchaseController = require('../controllers/purchase')

const authenticator = require('../middleware/authenticator')

const router = express.Router()

router.get('/premium',authenticator.authenticator,purchaseController.purchasePremium)

router.post('/updatestatus',authenticator.authenticator, purchaseController.updateStatus)

module.exports = router