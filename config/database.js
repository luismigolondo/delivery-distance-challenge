const mongoose = require('mongoose');

// @desc Se hace la conexion a la base de datos a traves de la libreria de mongoose.
const conectarBD = async () => {
    try {
        const conexion = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB conectada: ${conexion.connection.host}`)
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = conectarBD;