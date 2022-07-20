const express = require('express');
const router = express.Router();
const { getHistorial, addRegistro } = require('../controllers/historial');

// @route GET todo el historial
router.route('/').get(getHistorial);
// @route POST registro en el historial
router.route('/').post(addRegistro);

module.exports = router;