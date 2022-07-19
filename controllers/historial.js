const Registro = require('../modelos/Registro');


// @desc GET de todo el historial
// @route GET /api/historial
exports.getHistorial = async (req, res, next) => {
    try {
        const historial = await Registro.find();

        return res.status(200).json({
            success: true,
            count: historial.length,
            data: historial
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error en el Servidor'
        });
    }
};

// @desc POST Crear un nuevo registro de busqueda.
// @route POST /api/historial
exports.addRegistro = async (req, res, next) => {
    try {
        const registro = await Registro.create(req.body);

        return res.status(200).json({
            success: true,
            data: registro
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error en el Servidor'
        });
    }
};