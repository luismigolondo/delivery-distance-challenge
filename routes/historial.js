const express = require('express');
const router = express.Router();
const { getHistorial, addRegistro} = require('../controllers/historial');

router.route('/').post(addRegistro);

module.exports = router;