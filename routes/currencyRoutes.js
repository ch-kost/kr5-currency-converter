const express = require('express');
const router = express.Router();
const controller = require('../controllers/currencyController');

// rates
router.get('/rates', controller.getRates);          // req.query (base)
router.get('/rates/:base', controller.getRatesByBase); // req.params
router.put('/rates', controller.updateRates);       // (опц.) PUT

// convert
router.get('/convert', controller.convertQuery);    // req.query
router.post('/convert', controller.convertBody);    // body (json/urlencoded)

module.exports = router;
